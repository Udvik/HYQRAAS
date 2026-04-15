from app.services.generator_service import generate_key

for mode in ["classical", "quantum", "hybrid"]:
    result = generate_key(mode, 16)
    print(f"\nMode: {mode}")
    print(result)