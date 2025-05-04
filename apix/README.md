# Transfer Validation API

A FastAPI application that provides an endpoint for validating transfers.

## Running with Docker

1. Build the Docker image:
```bash
docker build -t transfer-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 transfer-api
```

The API will be available at http://localhost:8000

## API Documentation

Once the application is running, you can access:
- Swagger UI documentation: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## Example Request

```bash
curl -X POST "http://localhost:8000/api/v1/transfer/validate" \
     -H "Content-Type: application/json" \
     -d '{
           "fecha": "2019-04-12",
           "clave_rastreo": "CUENCA1555093850",
           "emisor": "90646",
           "receptor": "40012",
           "cuenta": "012180004643051249",
           "monto": 817
         }'
```

The API will return a JSON response with a `success` boolean and an optional `message` field. 