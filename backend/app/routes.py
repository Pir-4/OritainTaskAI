from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Sample
from app.schemas import SampleCreate, SampleResponse
from app.verification import verify

router = APIRouter(prefix="/samples", tags=["samples"])


@router.post("/", response_model=SampleResponse, status_code=201)
async def create_sample(
    data: SampleCreate,
    db: AsyncSession = Depends(get_db),
):
    sample = Sample(
        species=data.species,
        origin_country=data.origin_country,
        collected_at=data.collected_at,
        status="pending",
    )
    db.add(sample)
    await db.flush()
    sample.status = verify(sample.id)
    await db.commit()
    await db.refresh(sample)
    return sample


@router.get("/", response_model=list[SampleResponse])
async def list_samples(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Sample).order_by(Sample.id))
    return result.scalars().all()


@router.get("/{sample_id}", response_model=SampleResponse)
async def get_sample(
    sample_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Sample).where(Sample.id == sample_id))
    sample = result.scalar_one_or_none()
    if sample is None:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample
