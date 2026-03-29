from app.verification import VerificationStatus, verify


def test_verify_mod_0_returns_verified():
    assert verify(3) == VerificationStatus.VERIFIED
    assert verify(6) == VerificationStatus.VERIFIED
    assert verify(9) == VerificationStatus.VERIFIED


def test_verify_mod_1_returns_failed():
    assert verify(1) == VerificationStatus.FAILED
    assert verify(4) == VerificationStatus.FAILED
    assert verify(7) == VerificationStatus.FAILED


def test_verify_mod_2_returns_inconclusive():
    assert verify(2) == VerificationStatus.INCONCLUSIVE
    assert verify(5) == VerificationStatus.INCONCLUSIVE
    assert verify(8) == VerificationStatus.INCONCLUSIVE


def test_verify_deterministic():
    for i in range(1, 31):
        assert verify(i) == verify(i)


def test_verify_returns_enum():
    result = verify(1)
    assert isinstance(result, VerificationStatus)


def test_verify_string_value():
    assert verify(3) == VerificationStatus.VERIFIED
    assert verify(1) == VerificationStatus.FAILED
    assert verify(2) == VerificationStatus.INCONCLUSIVE
