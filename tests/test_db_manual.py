import json
from app.storage.database import SessionLocal, engine, Base
from app.storage.models import RNGLog

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    sample = RNGLog(
        key_hex="abcd1234",
        mode="classical",
        health_score=88.5,
        health_label="Healthy",
        validation_json=json.dumps({
            "monobit": {"ones": 10, "zeros": 6, "balance": 0.625},
            "runs": {"runs": 8},
            "entropy": {"entropy": 7.2, "entropy_per_bit": 0.9},
            "chi_square": {"chi_square": 12.5, "p_value": 0.41}
        }),
        latency_ms=4.73
    )

    db.add(sample)
    db.commit()

    rows = db.query(RNGLog).all()
    print(f"Inserted successfully. Total rows: {len(rows)}")

finally:
    db.close()