import requests

from faker import Faker

fake = Faker()

r = requests.post('http://localhost:3003/api/blog',
                  json={
                      "title": fake.text(),
                      "author": fake.name(),
                      "url": fake.url(),
                      "likes": fake.random_int(),
                  })
