// types.ts
export interface Role {
  id: number;
  roleName: string;
}

export interface User {
  id: number;
  username: string;
  roles: Role[]; // Updated to reflect that roles is an array of Role objects
  fullName: string;
  email: string;
  phone: string;
  address: string;
  nickname: string;
  birthday: string; // Keep as string if your backend uses ISO date strings
  image: string;
  identityCard: string;
  active: boolean;
  createdBy: string; // Added based on JSON response
  updatedBy: string; // Added based on JSON response
  createdDate: string; // Added based on JSON response
  updatedDate: string; // Added based on JSON response
}
