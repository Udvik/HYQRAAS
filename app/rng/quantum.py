import random
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

simulator = AerSimulator()


def generate_quantum_bits(n_bits: int) -> str:
    qc = QuantumCircuit(n_bits, n_bits)
    qc.h(range(n_bits))
    qc.measure(range(n_bits), range(n_bits))

    result = simulator.run(qc, shots=1).result()
    measured = list(result.get_counts().keys())[0][::-1]

    noisy_bits = []
    prev_bit = None

    for bit in measured:
        current = bit

        if current == "1" and random.random() < 0.11:
            current = "0"
        elif current == "0" and random.random() < 0.01:
            current = "1"

        if prev_bit is not None and random.random() < 0.04:
            current = prev_bit

        noisy_bits.append(current)
        prev_bit = current

    return "".join(noisy_bits)


def generate_quantum_bytes(n_bytes: int) -> bytes:
    if n_bytes <= 0:
        return b""

    bitstring = generate_quantum_bits(n_bytes * 8)
    return int(bitstring, 2).to_bytes(n_bytes, byteorder="big")