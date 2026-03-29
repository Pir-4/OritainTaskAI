from datetime import datetime

from sqlalchemy import DateTime, Float, String, func
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
)


class Base(DeclarativeBase):
    pass


class Sample(Base):
    __tablename__ = "samples"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(255))
    claimed_origin: Mapped[str] = mapped_column(String(255))
    isotope_ratio_o18: Mapped[float] = mapped_column(Float)
    isotope_ratio_c13: Mapped[float] = mapped_column(Float)
    trace_element_sr: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
