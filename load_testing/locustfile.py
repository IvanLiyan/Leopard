import random
from locust import HttpUser, task, between

# TODO [lliepert]: list can be generated and confirmed once auth issues on staging are solved
MIDS = []


class User(HttpUser):
    wait_time = between(1, 5)

    @task
    def view_storefront(self):
        self.client.get("/h/storefront{mid}".format(mid=random.choice(MIDS)))

    # uncomment if required during load testing
    # def on_start(self):
    #     # log in user to wish
