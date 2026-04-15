from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from app.storage.database import Base


class RNGLog(Base):
    __tablename__ = "rng_logs"

    id = Column(Integer, primary_key=True, index=True)
    key_hex = Column(Text, nullable=False)
    mode = Column(String, nullable=False)
    health_score = Column(Float, nullable=False)
    health_label = Column(String, nullable=False)
    validation_json = Column(Text, nullable=False)
    latency_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)