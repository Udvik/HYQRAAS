import os

def generate_classical_bytes(n_bytes: int) -> bytes:
    return os.urandom(n_bytes)