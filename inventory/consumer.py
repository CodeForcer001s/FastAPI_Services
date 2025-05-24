from main import redis, Product
import time

key = 'order_completed'
group = 'inventory_group'

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
        print(results)

    except Exception as e:
        print(str(e))
    time.sleep(1)