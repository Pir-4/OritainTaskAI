from enum import StrEnum


class VerificationStatus(StrEnum):
    VERIFIED = "verified"
    FAILED = "failed"
    INCONCLUSIVE = "inconclusive"


def verify(sample_id: int) -> VerificationStatus:
    match sample_id % 3:
        case 0:
            return VerificationStatus.VERIFIED
        case 1:
            return VerificationStatus.FAILED
        case _:
            return VerificationStatus.INCONCLUSIVE
