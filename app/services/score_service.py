def clamp(v, low, high):
    return max(low, min(high, v))


def score_entropy(entropy_per_bit: float) -> float:
    
    if entropy_per_bit >= 0.99:
        return 100
    elif entropy_per_bit >= 0.97:
        return 96 + ((entropy_per_bit - 0.97) / 0.02) * 4
    elif entropy_per_bit >= 0.94:
        return 85 + ((entropy_per_bit - 0.94) / 0.03) * 11
    elif entropy_per_bit >= 0.90:
        return 72 + ((entropy_per_bit - 0.90) / 0.04) * 13
    elif entropy_per_bit >= 0.85:
        return 60 + ((entropy_per_bit - 0.85) / 0.05) * 12
    elif entropy_per_bit >= 0.80:
        return 48 + ((entropy_per_bit - 0.80) / 0.05) * 12
    else:
        return clamp((entropy_per_bit / 0.80) * 48, 0, 48)


def score_monobit(balance: float) -> float:
   
    deviation = abs(balance - 0.5)

    if deviation <= 0.005:
        return 100
    elif deviation <= 0.01:
        return 96
    elif deviation <= 0.02:
        return 90
    elif deviation <= 0.03:
        return 80
    elif deviation <= 0.05:
        return 65
    elif deviation <= 0.08:
        return 40
    else:
        return 15


def score_runs(runs: int, total_bits: int) -> float:
    
    if total_bits <= 1:
        return 0

    expected_runs = total_bits / 2
    deviation_ratio = abs(runs - expected_runs) / expected_runs

    if deviation_ratio <= 0.01:
        return 100
    elif deviation_ratio <= 0.02:
        return 96
    elif deviation_ratio <= 0.04:
        return 90
    elif deviation_ratio <= 0.06:
        return 82
    elif deviation_ratio <= 0.10:
        return 70
    elif deviation_ratio <= 0.15:
        return 55
    elif deviation_ratio <= 0.20:
        return 40
    else:
        return 20


def score_chi_square(p_value: float) -> float:
    
    if p_value >= 0.05:
        return 100
    elif p_value >= 0.01:
        return 85
    elif p_value >= 0.001:
        return 60
    else:
        return 30


def build_explanation(entropy_per_bit: float, balance: float, runs: int, p_value: float, label: str) -> str:
    entropy_text = (
        "Entropy is very high, which indicates strong unpredictability."
        if entropy_per_bit >= 0.97 else
        "Entropy is good, which suggests healthy randomness."
        if entropy_per_bit >= 0.94 else
        "Entropy is moderate, so randomness quality is acceptable."
        if entropy_per_bit >= 0.90 else
        "Entropy is somewhat low, so randomness quality is reduced."
    )

    balance_text = (
        "Bit balance is very close to ideal."
        if abs(balance - 0.5) <= 0.01 else
        "Bit balance is acceptable."
        if abs(balance - 0.5) <= 0.03 else
        "Bit balance is slightly uneven."
    )

    chi_text = (
        "Chi-square result very good."
        if p_value >= 0.05 else
        "Chi-square result is acceptable."
        if p_value >= 0.01 else
        "Chi-square result suggests some statistical weakness."
    )

    return (
        f"{entropy_text} {balance_text} "
        f"Runs count was {runs}, and chi-square p-value was {round(p_value, 4)}. "
        f"Overall randomness quality is {label.lower()}. {chi_text}"
    )


def compute_health_score(validation: dict):
    balance = validation["monobit"]["balance"]
    runs = validation["runs"]["runs"]
    entropy_per_bit = validation["min_entropy"]["min_entropy_per_bit"]
    p_value = validation["chi_square"]["p_value"]

    total_bits = validation["monobit"]["ones"] + validation["monobit"]["zeros"]

    entropy_score = score_entropy(entropy_per_bit)
    monobit_score = score_monobit(balance)
    runs_score = score_runs(runs, total_bits)
    chi_score = score_chi_square(p_value)

    raw_score = (
        0.40 * entropy_score +
        0.30 * monobit_score +
        0.15 * runs_score +
        0.15 * chi_score
    )

    final_score = round(clamp(raw_score, 0, 100), 2)

    if final_score >= 78:
        label = "Healthy"
        color = "green"
    elif final_score >= 52:
        label = "Moderate"
        color = "orange"
    else:
        label = "Critical"
        color = "red"

    explanation = build_explanation(
        entropy_per_bit=entropy_per_bit,
        balance=balance,
        runs=runs,
        p_value=p_value,
        label=label
    )

    return {
        "score": final_score,
        "label": label,
        "color": color,
        "explanation": explanation,
        "subscores": {
            "entropy_score": round(entropy_score, 2),
            "monobit_score": round(monobit_score, 2),
            "runs_score": round(runs_score, 2),
            "chi_square_score": round(chi_score, 2),
        }
    }