export type UserStatus = "UNVERIFIED" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
export type UserRole = "CUSTOMER" | "SUPPORT" | "ADMIN";

export interface StatusHistoryEntry {
  status: UserStatus;
  timestamp: string;
  reason?: string;
  actorId?: string;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UserAuth {
  failedLoginAttempts: number;
  lockedUntil?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  passwordChangedAt?: string;
  tokenVersion: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  auth: UserAuth;
  address: UserAddress;
  statusHistory: StatusHistoryEntry[];
  deactivatedAt?: string;
  suspendedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}
