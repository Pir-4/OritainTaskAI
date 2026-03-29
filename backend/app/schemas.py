from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SampleCreate(BaseModel):
    species: str = Field(min_length=1, max_length=255)
    origin_country: str = Field(min_length=1, max_length=255)
    collected_at: datetime | None = None


class SampleResponse(SampleCreate):
    id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
