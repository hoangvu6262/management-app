import { apiCall } from './api';
import Cookies from 'js-cookie';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  role: string;
  user: UserInfo;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiCall<LoginResponse>('POST', '/auth/login', credentials);
    
    // Store tokens in cookies
    const expiresAt = new Date(response.expiresAt);
    
    Cookies.set('accessToken', response.accessToken, {
      expires: expiresAt,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    Cookies.set('refreshToken', response.refreshToken, {
      expires: 7, // 7 days
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    Cookies.set('user', JSON.stringify(response.user), {
      expires: 7,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<UserInfo> {
    return await apiCall<UserInfo>('POST', '/auth/register', userData);
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await apiCall('POST', '/auth/change-password', passwordData);
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiCall<LoginResponse>('POST', '/auth/refresh-token', {
      refreshToken
    });
    
    // Update tokens in cookies
    const expiresAt = new Date(response.expiresAt);
    
    Cookies.set('accessToken', response.accessToken, {
      expires: expiresAt,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    Cookies.set('refreshToken', response.refreshToken, {
      expires: 7,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    Cookies.set('user', JSON.stringify(response.user), {
      expires: 7,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await apiCall('POST', '/auth/revoke-token', { refreshToken });
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    } finally {
      // Clear all auth-related cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
    }
  }

  async revokeAllTokens(): Promise<void> {
    await apiCall('POST', '/auth/revoke-all-tokens');
    this.clearAuthData();
  }

  getCurrentUser(): UserInfo | null {
    try {
      const userCookie = Cookies.get('user');
      return userCookie ? JSON.parse(userCookie) : null;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  clearAuthData(): void {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
  }
}

export const authService = new AuthService();
