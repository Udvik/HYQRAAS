from app.rng.classical import generate_classical_bytes
from app.validate.tests import run_all_validation

data = generate_classical_bytes(32)
result = run_all_validation(data)

print(result)