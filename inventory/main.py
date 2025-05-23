from typing import Union
from redis_om import get_redis_connection,HashModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

# Gonna create a middleware here CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

redis = get_redis_connection(
    host="redis-13134.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
    port=13134,
    password="MrzOT9yiMmg9hrriKN31BlpDJNpgEZC3",
    decode_responses=True
)
#Now we wanna create a DB model that will be converted into a table inside the REDIS.
class Product(HashModel):
    name: str
    price: float
    quantity: int
    # A class that gives is connection to DB
    class Meta:
        database = redis   

# We start generating requests from here 


@app.get("/products")
# Read em all and throw themm back [READ]
def all():
    return [format(pk) for pk in Product.all_pks()]
# Just formatify / beautify the string [INDIRECT READ]
def format(pk: str):
    product = Product.get(pk)
    return {
        "id": product.pk,
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity,
    }

# Created product is saved once POSTED [CREATE]
@app.post("/products")
def create(product: Product):
    return product.save()
# Get a single product [READ]
@app.get("/products/{pk}")
def get(pk: str):
    try:
        return Product.get(pk)
    except Exception as e:
        return {"error": "Product not found", "details": str(e)}

@app.delete("/products/{pk}")
def delete(pk: str):
    return Product.delete(pk)

