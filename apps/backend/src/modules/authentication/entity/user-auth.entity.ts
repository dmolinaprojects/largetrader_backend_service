export class UserAuthEntity {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  passwordHash: string;
  roleId: number;
  roleName: string;
  permissions: string[];
  socialId?: number;
  valid: boolean;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
  isActive: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}
