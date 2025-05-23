from typing import Union
from redis_om import get_redis_connection,HashModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from starlette.requests import Request
import requests

app = FastAPI()

# Gonna create a middleware here CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In any ideal situation we should not hardcode the connection details here + we should connect to a different DB as this is a different microservices. 
redis = get_redis_connection(
    host="redis-13134.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
    port=13134,
    password="MrzOT9yiMmg9hrriKN31BlpDJNpgEZC3",
    decode_responses=True
)

class Order(HashModel):
    product_id: str
    price : float
    fee : float
    total : float
    quantity : int
    status : str # pending, completed, refunded
    class Meta : 
        database = redis 

@app.post('/orders')
async def create(request: Request):
    body = await request.json()
    req = requests.get('http://localhost:8000/products/%s' % body['id'])
    
    return req.json()