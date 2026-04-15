import time
from app.rng.classical import generate_classical_bytes
from app.rng.quantum import generate_quantum_bytes
from app.rng.hybrid import generate_hybrid_bytes

def generate_key(mode: str, n_bytes: int):
    start = time.perf_counter()

    if mode == "classical":
        generated = generate_classical_bytes(n_bytes)
    elif mode == "quantum":
        generated = generate_quantum_bytes(n_bytes)
    elif mode == "hybrid":
        generated = generate_hybrid_bytes(n_bytes)
    else:
        raise ValueError("Invalid mode")

    latency_ms = round((time.perf_counter() - start) * 1000, 3)

    return {
        "key_hex": generated.hex(),
        "mode": mode,
        "latency_ms": latency_ms
    }