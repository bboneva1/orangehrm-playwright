import { test, expect } from '@fixtures/test';
import { buildEmployee } from '@utils/factories';

const EMPLOYEES = '/web/index.php/api/v2/pim/employees';

test('GET the employee list', async ({ request }) => {
  const response = await request.get(EMPLOYEES);
  await expect(response).toBeOK();
  const body = await response.json();
  await expect(Array.isArray(body.data)).toBe(true);
});

//1. List shape
test('every employee in the list has the expected fields', async ({ request }) => {
  const response = await request.get(EMPLOYEES);
  await expect(response).toBeOK();
  const body = await response.json();

  expect(body.meta.total).toEqual(expect.any(Number));
  expect(body.data.length).toBeGreaterThan(0); //an empty list would let the loop check nothing

  for (const employee of body.data) {
    expect(employee).toEqual(
      expect.objectContaining({
        empNumber: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        employeeId: expect.any(String),
        middleName: expect.any(String),
        terminationId: null,
      })
    );
  }
});

// 2. Create, read, delete
test('create, read and delete an employee', async ({ request }) => {
  const employee = buildEmployee();

  // create
  const createResponse = await request.post(EMPLOYEES, {
    data: employee,
  });
  await expect(createResponse).toBeOK();
  const created = await createResponse.json();
  const empNumber = created.data.empNumber;

  // read it back: same names and id as we sent
  const readResponse = await request.get(`${EMPLOYEES}/${empNumber}`);
  await expect(readResponse).toBeOK();
  const read = await readResponse.json();
  expect(read.data).toEqual(expect.objectContaining(employee));

  // delete
  const deleteResponse = await request.delete(EMPLOYEES, { data: { ids: [empNumber] } });
  await expect(deleteResponse).toBeOK();

  // read again: OrangeHRM answers 422 (not 404) for an employee that doesn't exist
  const goneResponse = await request.get(`${EMPLOYEES}/${empNumber}`);
  expect(goneResponse.status()).toBe(422);
});

// 3. Bad input
test('creating an employee without firstName is rejected', async ({ request }) => {
  const { lastName, employeeId } = buildEmployee(); // leave firstName out

  const response = await request.post(EMPLOYEES, { data: { lastName, employeeId } });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error.data.invalidParamKeys).toEqual(['firstName']);
});

// 4. Not logged in
test.describe('without a session', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // no key card, only inside this block

  test('the API answers 401', async ({ request }) => {
    const response = await request.get(EMPLOYEES);
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error.message).toBe('Session expired');
  });
});
