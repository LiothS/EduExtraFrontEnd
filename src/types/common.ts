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
  description: string;
  birthday: string; // Keep as string if your backend uses ISO date strings
  image: string;
  identityCard: string;
  active: boolean;
  createdBy: string; // Added based on JSON response
  updatedBy: string; // Added based on JSON response
  createdDate: string; // Added based on JSON response
  updatedDate: string; // Added based on JSON response
}

export interface Contract {
  id: number;
  name: string;
  contractType: string;
  userId: number;
  startDate: string;
  expiredDate: string;
  earnType: string;
  currency: string;
  amount: number;
  per: string;
  isTerminated: boolean;
  terminatedBy: string | null;
  terminatedDate: string | null;
  course: Course[];
  employeeName: string;
  employeeIdentity: string;
}

export interface ContractsResponse {
  content: Contract[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
export interface Course {
  id: number;
  name: string;
  courseCode: string;
  description: string;
  price: number;
  studentLimit: number;
  startDate: string;
  schedule: Array<{
    dayOfWeek: string;
    start: string;
    end: string;
  }>;
  active: boolean;
  room: string;
  owner: string;
  categoryName: string;
  contractId: number | null;
  categoryId: number;
  userId: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdDate: string; // or Date if you prefer handling dates as Date objects
  updatedDate?: string; // or Date if you prefer handling dates as Date objects
  createdBy?: string;
  updatedBy?: string;
}

// types/common.ts

export interface Student {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  relativePhone: string;
  address: string;
  nickname: string;
  code: string;
  birthday: string; // Date in ISO format
  active: boolean;
  joinTime: string; // Date in ISO format
  createdDate: string; // Date in ISO format
  updatedDate: string | null; // Date in ISO format or null
  createdBy: string;
  updatedBy: string | null; // Nullable string
}

export interface StudentCourse {
  studentId: number;
  studentCode: string;
  studentFullName: string;
  studentPhone: string;
  isPaid: boolean;
  unpaidMonths: number;
  remainingAmount: number;
}
