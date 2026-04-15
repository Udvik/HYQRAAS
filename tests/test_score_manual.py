from app.rng.classical import generate_classical_bytes
from app.validate.tests import run_all_validation
from app.services.score_service import compute_health_score

data = generate_classical_bytes(32)
validation = run_all_validation(data)
score = compute_health_score(validation)

print("VALIDATION:")
print(validation)

print("\nHEALTH SCORE:")
print(score)