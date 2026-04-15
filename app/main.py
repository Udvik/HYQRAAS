import json
from datetime import datetime

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.schemas import GenerateKeyRequest, LotteryRequest
from app.services.generator_service import generate_key
from app.validate.tests import run_all_validation
from app.services.score_service import compute_health_score
from app.storage.database import Base, engine, SessionLocal
from app.storage import models
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

    return [
        {
            "id": log.id,
            "key_hex": log.key_hex,
            "mode": log.mode,
            "health_score": log.health_score,
            "health_label": log.health_label,
            "latency_ms": log.latency_ms,
            "timestamp": log.created_at.isoformat()
        }
        for log in logs
    ]


@app.get("/stats")
def stats(db: Session = Depends(get_db)):
    logs = db.query(RNGLog).all()

    if not logs:
        return {
            "total": 0,
            "by_mode": {}
        }

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

    by_mode = {
        mode: {
            "count": values["count"],
            "avg_health_score": round(values["score_sum"] / values["count"], 2),
            "avg_latency_ms": round(values["latency_sum"] / values["count"], 2)
        }
        for mode, values in grouped.items()
    }

    return {
        "total": len(logs),
        "by_mode": by_mode
    }


@app.get("/demo/otp")
def otp_demo(mode: str = "hybrid"):
    result = generate_key(mode, 4)

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

    result = generate_key(payload.mode, 4)

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