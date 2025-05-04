from fastapi import APIRouter, HTTPException
from cep import Transferencia
from cep.exc import TransferNotFoundError
from app.models.transfer import TransferRequest, TransferResponse

router = APIRouter()

@router.post("/transfer/validate", response_model=TransferResponse)
async def validate_transfer(transfer: TransferRequest) -> TransferResponse:
    try:
        tr = Transferencia.validar(
            fecha=transfer.fecha,
            clave_rastreo=transfer.clave_rastreo,
            emisor=transfer.emisor,
            receptor=transfer.receptor,
            cuenta=transfer.cuenta,
            monto=transfer.monto,
        )
        
        # Try to download the PDF to validate the transfer
        pdf = tr.descargar()
        
        # Save the PDF with the tracking key as filename
        with open(f"{transfer.clave_rastreo}.pdf", "wb") as f:
            f.write(pdf)
            
        return TransferResponse(
            success=True,
            message="Transfer validated successfully"
        )
        
    except TransferNotFoundError:
        return TransferResponse(
            success=False,
            message="Transfer not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while validating the transfer: {str(e)}"
        ) 