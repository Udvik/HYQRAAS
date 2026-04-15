import math
from collections import Counter
from scipy.stats import chisquare


def bytes_to_bits(data: bytes) -> str:
    return ''.join(f"{byte:08b}" for byte in data)


def monobit_test(bits: str):
    ones = bits.count("1")
    zeros = bits.count("0")
    total = len(bits)

    balance = ones / total if total else 0

    return {
        "ones": ones,
        "zeros": zeros,
        "balance": round(balance, 4)
    }


def runs_test(bits: str):
    if not bits:
        return {"runs": 0}

    runs = 1
    for i in range(1, len(bits)):
        if bits[i] != bits[i - 1]:
            runs += 1

    return {
        "runs": runs
    }


def shannon_entropy(data: bytes):
    if not data:
        return {"entropy": 0, "entropy_per_bit": 0}

    counts = Counter(data)
    total = len(data)

    entropy = -sum((count / total) * math.log2(count / total) for count in counts.values())
    entropy_per_bit = entropy / 8

    return {
        "entropy": round(entropy, 4),
        "entropy_per_bit": round(entropy_per_bit, 4)
    }


def min_entropy_test(bits: str):
    """
    Simple per-bit min-entropy estimate:
    H_min = -log2(max(P(0), P(1)))

    This is not a full SP 800-90B non-IID estimator,
    but it is much closer in spirit to the paper's reported
    min-entropy than Shannon entropy is.
    """
    if not bits:
        return {
            "p0": 0,
            "p1": 0,
            "min_entropy_per_bit": 0
        }

    zeros = bits.count("0")
    ones = bits.count("1")
    total = len(bits)

    p0 = zeros / total
    p1 = ones / total
    p_max = max(p0, p1)

    min_entropy = -math.log2(p_max) if p_max > 0 else 0

    return {
        "p0": round(p0, 4),
        "p1": round(p1, 4),
        "min_entropy_per_bit": round(min_entropy, 4)
    }


def chi_square_test(data: bytes):
    if not data:
        return {"chi_square": 0, "p_value": 0}

    counts = [0] * 256
    for byte in data:
        counts[byte] += 1

    expected = [len(data) / 256] * 256
    stat, p_value = chisquare(counts, expected)

    return {
        "chi_square": round(float(stat), 4),
        "p_value": round(float(p_value), 6)
    }


def run_all_validation(data: bytes):
    bits = bytes_to_bits(data)

    return {
        "monobit": monobit_test(bits),
        "runs": runs_test(bits),
        "entropy": shannon_entropy(data),
        "min_entropy": min_entropy_test(bits),
        "chi_square": chi_square_test(data)
    }