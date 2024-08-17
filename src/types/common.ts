// types.ts
export interface User {
  id: number; // Replace with the correct type for your ID field
  username: string;
  roles: string[];
  fullName: string;
  password: string; // Sensitive data typically not exposed; adjust as needed
  email: string;
  phone: string;
  address: string;
  nickname: string;
  birthday: string; // Adjust type if using a Date object
  image: string;
  identityCard: string;
  active: boolean;
}
