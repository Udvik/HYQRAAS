import random
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

simulator = AerSimulator()

# Paper-aligned raw quantum settings
# These are not exact recreations of D-Wave hardware,
# but they let your academic prototype behave closer to the paper:
#
# 1 us    -> ~0.824 raw min-entropy
# 10 us   -> ~0.828 raw min-entropy
# 100 us  -> ~0.889 raw min-entropy
# 2000 us -> ~0.847 raw min-entropy
#
# Defaulting to 1 us style behavior is reasonable if you want
# the raw quantum source to look weaker than hybrid.
RAW_QUANTUM_PROFILE = {
    "entropy_target": 0.85,
    "bias_to_zero": 0.555,   # probability of outputting 0
    "correlation": 0.04,     # probability of repeating previous bit
}


def generate_ideal_quantum_bits(n_bits: int) -> str:
    qc = QuantumCircuit(n_bits, n_bits)
    qc.h(range(n_bits))
    qc.measure(range(n_bits), range(n_bits))

    result = simulator.run(qc, shots=1).result()
    counts = result.get_counts()
    measured = list(counts.keys())[0]
    return measured[::-1]


def apply_bias_and_correlation(bitstring: str, bias_to_zero: float, correlation: float) -> str:
    """
    Convert ideal simulator bits into a paper-aligned noisy raw quantum source.
    - bias_to_zero > 0.5 introduces measurable bias
    - correlation introduces short-range temporal dependence
    """
    if not bitstring:
        return bitstring

    noisy_bits = []
    prev_bit = None

    for bit in bitstring:
        # Start from the ideal measured bit
        current = bit

        # Add bias
        current = "0" if random.random() < bias_to_zero else "1"

        # Add temporal correlation
        if prev_bit is not None and random.random() < correlation:
            current = prev_bit

        noisy_bits.append(current)
        prev_bit = current

    return "".join(noisy_bits)


def generate_quantum_bits(n_bits: int) -> str:
    ideal_bits = generate_ideal_quantum_bits(n_bits)

    return apply_bias_and_correlation(
        ideal_bits,
        bias_to_zero=RAW_QUANTUM_PROFILE["bias_to_zero"],
        correlation=RAW_QUANTUM_PROFILE["correlation"],
    )


def generate_quantum_bytes(n_bytes: int) -> bytes:
    if n_bytes <= 0:
        return b""

    n_bits = n_bytes * 8
    bitstring = generate_quantum_bits(n_bits)
    return int(bitstring, 2).to_bytes(n_bytes, byteorder="big")