import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}. Copy .env.example to .env.`);
  return value;
}

export const credentials = {
  username: required('ORANGEHRM_ADMIN_USER'),
  password: required('ORANGEHRM_ADMIN_PASSWORD'),
  firstName: required('ORANGEHRM_FIRST_NAME'),
  lastName: required('ORANGEHRM_LAST_NAME'),
};
