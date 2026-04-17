import json
from datetime import datetime
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.schemas import GenerateKeyRequest, LotteryRequest
from app.services.generator_service import generate_key
from app.validate.tests import run_all_validation
from app.services.score_service import compute_health_score
from app.storage.database import Base, engine, SessionLocal
from app.storage.models import RNGLog

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HyQRaaS API",
    description="Hybrid Quantum-Classical Randomness-as-a-Service backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def compute_pass_count_from_validation(validation: dict) -> int:
    passes = 0

    balance = validation.get("monobit", {}).get("balance", 0)
    if 0.48 <= balance <= 0.52:
        passes += 1

    min_entropy = validation.get("min_entropy", {}).get("min_entropy_per_bit", 0)
    if min_entropy >= 0.85:
        passes += 1

    p_value = validation.get("chi_square", {}).get("p_value", 0)
    if p_value >= 0.01:
        passes += 1

    runs = validation.get("runs", {}).get("runs", 0)
    ones = validation.get("monobit", {}).get("ones", 0)
    zeros = validation.get("monobit", {}).get("zeros", 0)
    total_bits = ones + zeros
    expected_runs = total_bits / 2 if total_bits else 0

    if expected_runs > 0:
        deviation_ratio = abs(runs - expected_runs) / expected_runs
        if deviation_ratio <= 0.10:
            passes += 1

    return passes


@app.get("/")
def root():
    return {"message": "HyQRaaS backend is running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "HyQRaaS API"
    }


@app.post("/generate-key")
def generate_key_api(payload: GenerateKeyRequest, db: Session = Depends(get_db)):
    result = generate_key(payload.mode, payload.key_length)

    raw_bytes = bytes.fromhex(result["key_hex"])
    validation = run_all_validation(raw_bytes)
    score = compute_health_score(validation)

    log = RNGLog(
        key_hex=result["key_hex"],
        mode=result["mode"],
        health_score=score["score"],
        health_label=score["label"],
        validation_json=json.dumps(validation),
        latency_ms=result["latency_ms"]
    )

    db.add(log)
    db.commit()

    return {
        "generated_key": result["key_hex"],
        "source_mode": result["mode"],
        "health_score": score,
        "validation_metrics": validation,
        "latency_ms": result["latency_ms"],
        "timestamp": datetime.utcnow().isoformat(),
        "explanation": score["explanation"]
    }


@app.get("/history")
def history(db: Session = Depends(get_db)):
    logs = db.query(RNGLog).order_by(RNGLog.created_at.desc()).limit(20).all()

    history_data = []

    for log in logs:
        try:
            validation = json.loads(log.validation_json) if log.validation_json else {}
        except Exception:
            validation = {}

        min_entropy = validation.get("min_entropy", {}).get("min_entropy_per_bit", None)
        shannon_entropy = validation.get("entropy", {}).get("entropy_per_bit", None)

        key_preview = (
            f"{log.key_hex[:3]}...{log.key_hex[-3:]}"
            if log.key_hex and len(log.key_hex) > 6
            else log.key_hex
        )

        history_data.append(
            {
                "id": log.id,
                "key_hex": log.key_hex,                 # full key
                "key_preview": key_preview,            # compressed key
                "mode": log.mode,
                "health_score": log.health_score,
                "health_label": log.health_label,
                "latency_ms": log.latency_ms,
                "min_entropy": min_entropy,
                "shannon_entropy": shannon_entropy,
                "timestamp": log.created_at.isoformat()
            }
        )

    return history_data


@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    logs = db.query(RNGLog).order_by(RNGLog.created_at.asc()).all()

    if not logs:
        return {
            "total_keys": 0,
            "avg_health_score": 0,
            "avg_latency": 0,
            "recommended_mode": "Hybrid",
            "mode_breakdown": [],
            "recent_trend": []
        }

    total_keys = len(logs)
    avg_health_score = round(sum(log.health_score for log in logs) / total_keys, 2)
    avg_latency = round(sum(log.latency_ms for log in logs) / total_keys, 2)

    grouped = {}
    for log in logs:
        if log.mode not in grouped:
            grouped[log.mode] = {
                "count": 0,
                "score_sum": 0,
                "latency_sum": 0
            }

        grouped[log.mode]["count"] += 1
        grouped[log.mode]["score_sum"] += log.health_score
        grouped[log.mode]["latency_sum"] += log.latency_ms

    mode_breakdown = []
    best_mode = None
    best_score = -1

    for mode, values in grouped.items():
        avg_score = round(values["score_sum"] / values["count"], 2)
        avg_latency_ms = round(values["latency_sum"] / values["count"], 2)

        mode_breakdown.append({
            "mode": mode,
            "count": values["count"],
            "avg_health_score": avg_score,
            "avg_latency_ms": avg_latency_ms
        })

        if avg_score > best_score:
            best_score = avg_score
            best_mode = mode

    recent_trend = [
        {
            "timestamp": log.created_at.isoformat(),
            "score": log.health_score,
            "mode": log.mode
        }
        for log in logs[-10:]
    ]

    return {
        "total_keys": total_keys,
        "avg_health_score": avg_health_score,
        "avg_latency": avg_latency,
        "recommended_mode": best_mode.capitalize() if best_mode else "Hybrid",
        "mode_breakdown": mode_breakdown,
        "recent_trend": recent_trend
    }


@app.get("/analytics")
def analytics(db: Session = Depends(get_db)):
    logs = db.query(RNGLog).all()

    grouped = {
        "quantum": [],
        "hybrid": []
    }

    for log in logs:
        if log.mode in grouped:
            try:
                validation = json.loads(log.validation_json) if log.validation_json else {}
            except Exception:
                validation = {}

            pass_count = compute_pass_count_from_validation(validation) if validation else 0
            min_entropy = validation.get("min_entropy", {}).get("min_entropy_per_bit", 0)

            grouped[log.mode].append({
                "score": log.health_score,
                "latency": log.latency_ms,
                "pass_count": pass_count,
                "min_entropy": min_entropy
            })

    def summarize(entries):
        if not entries:
            return {
                "avg_score": 0,
                "avg_min_entropy": 0,
                "avg_pass_count": 0,
                "full_pass_percent": 0,
                "avg_latency": 0,
                "count": 0
            }

        count = len(entries)
        avg_score = round(sum(x["score"] for x in entries) / count, 2)
        avg_min_entropy = round(sum(x["min_entropy"] for x in entries) / count, 4)
        avg_pass_count = round(sum(x["pass_count"] for x in entries) / count, 2)
        full_pass_percent = round((sum(1 for x in entries if x["pass_count"] == 4) / count) * 100, 2)
        avg_latency = round(sum(x["latency"] for x in entries) / count, 2)

        return {
            "avg_score": avg_score,
            "avg_min_entropy": avg_min_entropy,
            "avg_pass_count": avg_pass_count,
            "full_pass_percent": full_pass_percent,
            "avg_latency": avg_latency,
            "count": count
        }

    quantum_summary = summarize(grouped["quantum"])
    hybrid_summary = summarize(grouped["hybrid"])

    comparison = [
        {
            "metric": "Average Score",
            "quantum": quantum_summary["avg_score"],
            "hybrid": hybrid_summary["avg_score"]
        },
        {
            "metric": "Min-Entropy",
            "quantum": quantum_summary["avg_min_entropy"],
            "hybrid": hybrid_summary["avg_min_entropy"]
        },
        {
            "metric": "Full Pass %",
            "quantum": quantum_summary["full_pass_percent"],
            "hybrid": hybrid_summary["full_pass_percent"]
        },
        {
            "metric": "Pass Count",
            "quantum": quantum_summary["avg_pass_count"],
            "hybrid": hybrid_summary["avg_pass_count"]
        },
        {
            "metric": "Latency",
            "quantum": quantum_summary["avg_latency"],
            "hybrid": hybrid_summary["avg_latency"]
        }
    ]

    return {
        "quantum": quantum_summary,
        "hybrid": hybrid_summary,
        "comparison": comparison
    }


@app.get("/demo/otp")
def otp_demo(mode: str = "hybrid"):
    result = generate_key(mode, 128)

    raw_bytes = bytes.fromhex(result["key_hex"])
    validation = run_all_validation(raw_bytes)
    score = compute_health_score(validation)

    otp_number = int(result["key_hex"], 16) % 1000000
    otp = str(otp_number).zfill(6)

    return {
        "otp": otp,
        "source_mode": mode,
        "health_score": score
    }


@app.post("/demo/lottery")
def lottery_demo(payload: LotteryRequest):
    if not payload.participants:
        return {"error": "No participants provided"}

    result = generate_key(payload.mode, 128)

    raw_bytes = bytes.fromhex(result["key_hex"])
    validation = run_all_validation(raw_bytes)
    score = compute_health_score(validation)

    winner_index = int(result["key_hex"], 16) % len(payload.participants)
    winner = payload.participants[winner_index]

    return {
        "winner": winner,
        "source_mode": payload.mode,
        "health_score": score
    }
@app.get("/benchmark-results")
def benchmark_results():
    benchmark_file = os.path.join("results", "benchmark_results.json")

    if not os.path.exists(benchmark_file):
        return {
            "quantum": {
                "avg_score": 0,
                "score_std_dev": 0,
                "avg_min_entropy": 0,
                "entropy_std_dev": 0,
                "avg_pass_count": 0,
                "full_pass_percent": 0,
                "avg_latency": 0
            },
            "hybrid": {
                "avg_score": 0,
                "score_std_dev": 0,
                "avg_min_entropy": 0,
                "entropy_std_dev": 0,
                "avg_pass_count": 0,
                "full_pass_percent": 0,
                "avg_latency": 0
            }
        }

    with open(benchmark_file, "r", encoding="utf-8") as f:
        return json.load(f)