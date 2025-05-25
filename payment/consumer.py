from main import redis, Order
import time

key = 'refund_order'
group = 'payment-group'

# Wait for 5 seconds to ensure stream exists
print("Waiting for services to start...")
time.sleep(5)

try:
    redis.xgroup_create(key, group, mkstream=True)
except:
    print("Group already exists")

while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)
        print("Listening for order completion events...")
        

        if results!=[]:
            print(results)
            for result in results:
                obj = result[1][0][1]
                order = Order.get(obj['pk'])
                order.status = 'refunded'
                order.save()

    except Exception as e:
        print(str(e))
    time.sleep(1)