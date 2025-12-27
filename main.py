from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos
class Producto(BaseModel):
    item: str
    precio: float

# Datos iniciales
db = [
    {"id": 1, "item": "Manzana", "precio": 0.5},
    {"id": 2, "item": "Plátano", "precio": 0.3},
    {"id": 3, "item": "Café", "precio": 2.5}
]

@app.get("/")
def index():
    return {"status": "online", "api": "Tienda API v1"}

@app.get("/productos")
def get_all():
    return db

@app.get("/productos/{id}")
def get_one(id: int):
    product = next((p for p in db if p["id"] == id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@app.post("/productos")
def create(payload: Producto):
    new_data = payload.model_dump()
    new_data["id"] = max([p["id"] for p in db], default=0) + 1
    db.append(new_data)
    return new_data

@app.put("/productos/{id}")
def update(id: int, payload: Producto):
    for p in db:
        if p["id"] == id:
            p.update(payload.model_dump())
            return {"msg": "Actualizado", "data": p}
    raise HTTPException(status_code=404, detail="No existe")

@app.delete("/productos/{id}")
def delete(id: int):
    for i, p in enumerate(db):
        if p["id"] == id:
            return {"deleted": db.pop(i)}
    raise HTTPException(status_code=404, detail="ID inválido")