# Load Testing

We use [locust](https://locust.io/) ([github](https://github.com/locustio/locust)) for load-testing leopard.

## Setup

_All commands should be run from the `leopard/load_testing` folder._

**Step 0: Confirm you're running `python 3.6 | 3.7 | 3.8 | 3.9`.**

On mac / ec2:

```
> python3 --version
Python 3.9.5
```

**Step 1: Install locust.**

```
> pip3 install locust
```

**Step 2: Run the test.**

```
> locust -f locustfile.py --headless -u <NUM_USERS_TO_SPAWN> -r <NUM_USERS_TO_START_PER_SECOND> -t <TIME_LIMIT> -H <URL_TO_TEST>
```

## Running Tests

todo

## Test Log

### Test 1:

todo
