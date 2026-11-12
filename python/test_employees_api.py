import os
import time
import random

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")
EMPLOYEES = f"{BASE_URL}/web/index.php/api/v2/pim/employees"


def build_employee():
    stamp = str(int(time.time() * 1000))[-7:]
    extra = random.randint(0, 999)
    unique = f"{stamp}{extra}"

    return {
        "firstName": f"Test{unique}",
        "lastName": f"PW{unique}",
        "employeeId": unique,
    }


def test_employee_list_returns_200(session):
    response = session.get(EMPLOYEES)
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["data"], list)


def test_create_read_delete_employee(session):
    employee = build_employee()
    create_response = session.post(EMPLOYEES, json=employee)
    assert create_response.status_code == 200
    created = create_response.json()
    emp_number = created["data"]["empNumber"]

    read_response = session.get(f"{EMPLOYEES}/{emp_number}")
    assert read_response.status_code == 200
    read = read_response.json()
    assert read["data"]["firstName"] == employee["firstName"]
    assert read["data"]["lastName"] == employee["lastName"]
    assert read["data"]["employeeId"] == employee["employeeId"]

    delete_response = session.delete(EMPLOYEES, json={"ids": [emp_number]})
    assert delete_response.status_code == 200

    gone_response = session.get(f"{EMPLOYEES}/{emp_number}")
    assert gone_response.status_code == 422


def test_missing_firstName_returns_422(session):
    employee = build_employee()
    del employee["firstName"]
    response = session.post(EMPLOYEES, json=employee)
    assert response.status_code == 422
    body = response.json()
    assert body["error"]["data"]["invalidParamKeys"] == ["firstName"]