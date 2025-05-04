from fastapi import FastAPI
from app.api.transfer import router as transfer_router

app = FastAPI(
    title="Transfer Validation API",
    description="API for validating and processing transfers",
    version="1.0.0"
)

app.include_router(transfer_router, prefix="/api/v1", tags=["transfers"]) 