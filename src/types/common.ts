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

export interface Course {
  id: number;
  name: string;
  contractId: number;
  userId: number;
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
