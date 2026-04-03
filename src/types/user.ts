export type UserStatus = "UNVERIFIED" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
export type UserRole = "CUSTOMER" | "SUPPORT" | "ADMIN";

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  address: Address;
  createdAt: string;
  updatedAt: string;
}
