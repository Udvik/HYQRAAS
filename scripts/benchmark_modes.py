import sys
import os
import time
import json
import statistics

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.generator_service import generate_key
from app.validate.tests import run_all_validation
from app.services.score_service import compute_health_score


MODES = ["quantum", "hybrid"]
N_RUNS = 20
N_BYTES = 512

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "results")
RESULTS_FILE = os.path.join(RESULTS_DIR, "benchmark_results.json")


def test_pass_count(validation: dict) -> int:
    passes = 0

    balance = validation.get("monobit", {}).get("balance", 0)
    if 0.48 <= balance <= 0.52:
        passes += 1

    min_entropy = validation.get("min_entropy", {}).get("min_entropy_per_bit", 0)
    if min_entropy >= 0.80:
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


def run_benchmark():
    results = {}

    for mode in MODES:
        scores = []
        min_entropies = []
        latencies = []
        balances = []
        p_values = []
        run_counts = []
        pass_counts = []

        print(f"\nRunning benchmark for: {mode}")
        start_time = time.time()

        for i in range(N_RUNS):
            result = generate_key(mode, N_BYTES)

            raw_bytes = bytes.fromhex(result["key_hex"])
            validation = run_all_validation(raw_bytes)
            score = compute_health_score(validation)

            scores.append(score["score"])
            min_entropies.append(validation.get("min_entropy", {}).get("min_entropy_per_bit", 0))
            latencies.append(result["latency_ms"])
            balances.append(validation.get("monobit", {}).get("balance", 0))
            p_values.append(validation.get("chi_square", {}).get("p_value", 0))
            run_counts.append(validation.get("runs", {}).get("runs", 0))
            pass_counts.append(test_pass_count(validation))

            elapsed = time.time() - start_time
            avg_time_per_run = elapsed / (i + 1)
            remaining_runs = N_RUNS - (i + 1)
            eta = avg_time_per_run * remaining_runs
            progress_percent = ((i + 1) / N_RUNS) * 100

            print(
                f"[{mode.upper()}] Run {i + 1}/{N_RUNS} "
                f"({progress_percent:.1f}%) | ETA: {eta:.1f}s",
                end="\r"
            )

        total_time = time.time() - start_time
        print(f"\nCompleted {mode} in {total_time:.2f} seconds\n")

        results[mode] = {
            "avg_score": round(statistics.mean(scores), 2),
            "score_std_dev": round(statistics.stdev(scores), 2) if len(scores) > 1 else 0,
            "avg_min_entropy": round(statistics.mean(min_entropies), 4),
            "entropy_std_dev": round(statistics.stdev(min_entropies), 4) if len(min_entropies) > 1 else 0,
            "avg_pass_count": round(statistics.mean(pass_counts), 2),
            "full_pass_percent": round((sum(pc == 4 for pc in pass_counts) / N_RUNS) * 100, 2),
            "avg_latency": round(statistics.mean(latencies), 2),
            "avg_balance": round(statistics.mean(balances), 4),
            "avg_p_value": round(statistics.mean(p_values), 6),
            "avg_runs": round(statistics.mean(run_counts), 2),
            "runs": N_RUNS,
            "bytes_per_run": N_BYTES
        }

    return results


def save_results(results):
    os.makedirs(RESULTS_DIR, exist_ok=True)
    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Benchmark results saved to: {RESULTS_FILE}")


def print_results(results):
    print("\n===== BENCHMARK RESULTS =====\n")

    header = (
        f"{'Mode':<10} | {'Avg Score':<10} | {'StdDev':<8} | "
        f"{'MinEnt':<8} | {'ME SD':<8} | {'Pass Avg':<8} | "
        f"{'Full Pass%':<10} | {'Latency(ms)':<12}"
    )
    print(header)
    print("-" * len(header))

    for mode, data in results.items():
        row = (
            f"{mode:<10} | "
            f"{data['avg_score']:<10} | "
            f"{data['score_std_dev']:<8} | "
            f"{data['avg_min_entropy']:<8} | "
            f"{data['entropy_std_dev']:<8} | "
            f"{data['avg_pass_count']:<8} | "
            f"{data['full_pass_percent']:<10} | "
            f"{data['avg_latency']:<12}"
        )
        print(row)

    print("\n")


if __name__ == "__main__":
    results = run_benchmark()
    print_results(results)
    save_results(results)