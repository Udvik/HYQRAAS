from pydantic import BaseModel
from typing import Literal, List


class GenerateKeyRequest(BaseModel):
    mode: Literal["classical", "quantum", "hybrid"]
    key_length: int


class LotteryRequest(BaseModel):
    participants: List[str]
    mode: Literal["classical", "quantum", "hybrid"]