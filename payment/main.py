from typing import Union
from pydantic.types import T
from redis_om import get_redis_connection,HashModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.background import BackgroundTasks
from fastapi import FastAPI
from starlette.requests import Request
import requests,time
from redis_om.model.model import NotFoundError
from fastapi import HTTPException

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


# Just a test fn
@app.get('/orders/{pk}')
def get(pk: str):
    try:
        return Order.get(pk)
    except NotFoundError:
        raise HTTPException(status_code=404, detail=f"Order with ID {pk} not found")

@app.post('/orders')
async def create(request: Request, background_tasks: BackgroundTasks):
    body = await request.json()
    req = requests.get('http://localhost:8000/products/%s' % body['id'])
    product = req.json()
    order = Order(
        product_id=body['id'],
        price=product['price'],
        fee=0.2*product['price'],
        total=1.2*product['price'],
        quantity=body['quantity'],
        status='pending'
    )
    order.save()
    print(f"Order created at: {time.strftime('%H:%M:%S')}")
    background_tasks.add_task(order_completed, order)
    return order

def order_completed(order: Order):
    try:
        print(f"\nStarting background task at: {time.strftime('%H:%M:%S')}")
        time.sleep(15)
        print(f"After 15 seconds delay: {time.strftime('%H:%M:%S')}")
        
        updated_order = Order.get(order.pk)
        updated_order.status = 'completed'
        updated_order.save()
        print(f"Order {updated_order.pk} status updated at: {time.strftime('%H:%M:%S')}")
        
        redis.xadd('order_completed', updated_order.model_dump(), '*')
        print(f"Stream message sent at: {time.strftime('%H:%M:%S')}\n")
    except Exception as e:
        print(f"Error in background task: {str(e)}")

#We do mark as completed but don't subtract from quantity in actual inventory service 
#We can achieve this by actual inventory service by using a message broker like RabbitMQ or Kafka but since we are using redis lezgo with redis streams
# It will allow us to communicate between services without them letting know who they are with each other.
# We already have connection to redis so let's send the above event to redis and get started.