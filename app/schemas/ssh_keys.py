from pydantic import BaseModel


class SSHPublicKeyResponse(BaseModel):
    public_key: str
    fingerprint: str
