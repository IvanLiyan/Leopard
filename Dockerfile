# Mitigating docker rate limit with this
FROM registry-gitlab.i.wish.com/contextlogic/tooling-image/python:3.7

WORKDIR /usr/src/app
COPY . .

EXPOSE 8080
CMD ["python3", "app/server.py"]
