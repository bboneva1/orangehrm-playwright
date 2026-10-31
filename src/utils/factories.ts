export function buildEmployee(): NewEmployee {
  const time = String(Date.now()).slice(-7);
  const random = Math.floor(Math.random() * 1000);
  const unique = `${time}${random}`;

  return {
    firstName: `Test${unique}`,
    lastName: `PW${unique}`,
    employeeId: unique,
  };
}

export type NewEmployee = {
  firstName: string;
  lastName: string;
  employeeId: string;
};
