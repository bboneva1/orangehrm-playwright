import json

import pytest
import requests


@pytest.fixture
def session():
    # before the test: read the saved login from Playwright's setup
    with open("playwright/.auth/admin.json") as f:
        state = json.load(f)
    cookie = next(c for c in state["cookies"] if c["name"] == "_orangehrm")

    s = requests.Session()
    s.cookies.set("_orangehrm", cookie["value"])
    
    yield s  # the test runs here, same as `await use(s)`

    # after the test
    s.close()
