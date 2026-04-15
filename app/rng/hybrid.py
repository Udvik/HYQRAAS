import hashlib
from app.rng.classical import generate_classical_bytes
from app.rng.quantum import generate_quantum_bytes


def generate_hybrid_bytes(n_bytes: int) -> bytes:
    """
    Final tuned hybrid generator:
    - uses classical + quantum + XOR streams
    - preserves more distributed mixed entropy
    - uses rotating chunk windows
    - uses evolving internal state for diffusion
    """

    if n_bytes <= 0:
        return b""

    classical = generate_classical_bytes(n_bytes)
    quantum = generate_quantum_bytes(n_bytes)
    mixed_xor = bytes(c ^ q for c, q in zip(classical, quantum))

    combined = classical + quantum + mixed_xor
    state = hashlib.sha256(combined).digest()

    output = bytearray()
    chunk_size = 64
    counter = 0

    while len(output) < n_bytes:
        start = (counter * 17) % len(combined)
        end = start + chunk_size

        if end <= len(combined):
            chunk = combined[start:end]
        else:
            overflow = end - len(combined)
            chunk = combined[start:] + combined[:overflow]

        c_start = (counter * 13) % len(classical)
        q_start = (counter * 19) % len(quantum)
        x_start = (counter * 23) % len(mixed_xor)

        c_slice = classical[c_start:c_start + 16]
        q_slice = quantum[q_start:q_start + 16]
        x_slice = mixed_xor[x_start:x_start + 16]

        if len(c_slice) < 16:
            c_slice += classical[:16 - len(c_slice)]
        if len(q_slice) < 16:
            q_slice += quantum[:16 - len(q_slice)]
        if len(x_slice) < 16:
            x_slice += mixed_xor[:16 - len(x_slice)]

        digest_input = (
            state +
            chunk +
            c_slice +
            q_slice +
            x_slice +
            counter.to_bytes(4, "big")
        )

        state = hashlib.sha256(digest_input).digest()
        output.extend(state)
        counter += 1

    return bytes(output[:n_bytes])