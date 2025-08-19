import { protectedApi } from "./protectedApi";

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

export interface UpdateProfileDto {
  fullName: string;
  email: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface TwoFactorSetupDto {
  secretKey: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface VerifyTwoFactorDto {
  code: string;
}

export interface AdminUserManagementDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UpdateUserRoleDto {
  role: string;
}

export interface SystemConfigDto {
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
  systemMessage: string;
}

export const profileService = {
  // Profile endpoints
  async getProfile(): Promise<UserProfileDto> {
    const response = await protectedApi.get("/profile");
    return response;
  },

  async updateProfile(updateData: UpdateProfileDto): Promise<boolean> {
    const response = await protectedApi.put("/profile", updateData);
    return response;
  },

  async changePassword(passwordData: ChangePasswordDto): Promise<boolean> {
    const response = await protectedApi.post(
      "/profile/change-password",
      passwordData
    );
    return response;
  },

  // Two-Factor Authentication
  async setupTwoFactor(): Promise<TwoFactorSetupDto> {
    const response = await protectedApi.post("/profile/setup-2fa");
    return response;
  },

  async verifyTwoFactor(verifyData: VerifyTwoFactorDto): Promise<boolean> {
    const response = await protectedApi.post("/profile/verify-2fa", verifyData);
    return response;
  },

  async disableTwoFactor(password: string): Promise<boolean> {
    const response = await protectedApi.post("/profile/disable-2fa", {
      currentPassword: password,
    });
    return response;
  },

  async regenerateBackupCodes(): Promise<string[]> {
    const response = await protectedApi.post(
      "/profile/regenerate-backup-codes"
    );
    return response;
  },

  // Admin endpoints
  async getAllUsers(): Promise<AdminUserManagementDto[]> {
    const response = await protectedApi.get("/profile/admin/users");
    return response;
  },

  async updateUserRole(
    targetUserId: string,
    newRole: string
  ): Promise<boolean> {
    const response = await protectedApi.put(
      `/profile/admin/users/${targetUserId}/role`,
      { role: newRole }
    );
    return response;
  },

  async toggleUserStatus(targetUserId: string): Promise<boolean> {
    const response = await protectedApi.put(
      `/profile/admin/users/${targetUserId}/toggle-status`
    );
    return response;
  },

  async getSystemConfig(): Promise<SystemConfigDto> {
    const response = await protectedApi.get("/profile/admin/system-config");
    return response;
  },

  async updateSystemConfig(config: SystemConfigDto): Promise<boolean> {
    const response = await protectedApi.put(
      "/profile/admin/system-config",
      config
    );
    return response;
  },
};
