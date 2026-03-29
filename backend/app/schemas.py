from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class SampleData(BaseModel):
    isotope_ratio_o18: float
    isotope_ratio_c13: float
    trace_element_sr: float


class SampleCreate(BaseModel):
    product_name: str = Field(min_length=1, max_length=255)
    claimed_origin: str = Field(min_length=1, max_length=255)
    sample_data: SampleData


class SampleResponse(BaseModel):
    id: int
    product_name: str
    claimed_origin: str
    sample_data: SampleData
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def assemble_sample_data(cls, v):
        if not isinstance(v, dict):
            return {
                "id": v.id,
                "product_name": v.product_name,
                "claimed_origin": v.claimed_origin,
                "sample_data": {
                    "isotope_ratio_o18": v.isotope_ratio_o18,
                    "isotope_ratio_c13": v.isotope_ratio_c13,
                    "trace_element_sr": v.trace_element_sr,
                },
                "status": v.status,
                "created_at": v.created_at,
            }
        return v
