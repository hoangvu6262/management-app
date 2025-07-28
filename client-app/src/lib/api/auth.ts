import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserInfo,
  ChangePasswordRequest,
  RefreshTokenRequest,
  ApiResponse
} from '@/types/api';

export class AuthService {
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  }

  static async register(data: RegisterRequest): Promise<ApiResponse<UserInfo>> {
    return apiClient.post<UserInfo>('/auth/register', data);
  }

  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return apiClient.post('/auth/change-password', data);
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/refresh-token', data);
  }

  static async revokeToken(refreshToken: string): Promise<ApiResponse> {
    return apiClient.post('/auth/revoke-token', { refreshToken });
  }

  static async revokeAllTokens(): Promise<ApiResponse> {
    return apiClient.post('/auth/revoke-all-tokens');
  }
}
