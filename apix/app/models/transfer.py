from datetime import date
from pydantic import BaseModel, Field

class TransferRequest(BaseModel):
    fecha: date
    clave_rastreo: str = Field(..., min_length=1)
    emisor: str = Field(..., min_length=1)
    receptor: str = Field(..., min_length=1)
    cuenta: str = Field(..., min_length=1)
    monto: int = Field(..., gt=0)  # Amount in cents

class TransferResponse(BaseModel):
    success: bool
    message: str | None = None 