import os

import pytest
import requests
from dotenv import load_dotenv

# Read .env and copy its values into os.environ (Python's list of settings).
load_dotenv()
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")  # .get = use the default if missing
USERNAME = os.environ["ORANGEHRM_ADMIN_USER"]  # [ ] = stop with an error if missing
PASSWORD = os.environ["ORANGEHRM_ADMIN_PASSWORD"]


@pytest.fixture
def session():
    s = requests.Session()

    # 1. Open the login page, like typing its address into a browser.
    #    OrangeHRM gives s a cookie, and hides a one-time token in the page's HTML.
    login_page = s.get(f"{BASE_URL}/web/index.php/auth/login")
    html = login_page.text  # the page's HTML, as one long string

    # 2. Cut the token out. In the HTML it looks like:  :token="&quot;abc123&quot;"
    #    .split(x) cuts a string at x and gives back the pieces as a list.
    #    Cut before the token and keep the right piece [1],
    #    then cut at the next &quot; and keep the left piece [0].
    token = html.split(':token="&quot;')[1].split("&quot;")[0]

    # 3. Send the login form. data= sends it as a form (what a login page sends).
    #    json= would send JSON (what your API tests send).
    response = s.post(
        f"{BASE_URL}/web/index.php/auth/validate",
        data={"_token": token, "username": USERNAME, "password": PASSWORD},
    )

    # 4. requests follows the redirect by itself, so response.url is where we landed.
    #    Success = the dashboard. Anything else: stop with a clear message.
    if "/dashboard" not in response.url:
        raise RuntimeError(f"Login failed, landed on {response.url}")

    yield s  # the test runs here, same as `await use(s)`

    # after the test
    s.close()
