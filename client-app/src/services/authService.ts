import { apiCall, authAxiosInstance } from "./api";
import Cookies from "js-cookie";

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
    try {
      // Use authAxiosInstance to avoid interceptor loops
      const response = await authAxiosInstance.post("/auth/login", credentials);

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      const loginResponse = response.data.data as LoginResponse;

      // Store tokens in cookies
      const expiresAt = new Date(loginResponse.expiresAt);

      Cookies.set("accessToken", loginResponse.accessToken, {
        expires: expiresAt,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      Cookies.set("refreshToken", loginResponse.refreshToken, {
        expires: 7, // 7 days
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      Cookies.set("user", JSON.stringify(loginResponse.user), {
        expires: 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return loginResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }

  async register(userData: RegisterRequest): Promise<UserInfo> {
    try {
      // Use authAxiosInstance to avoid interceptor loops
      const response = await authAxiosInstance.post("/auth/register", userData);

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }
      return response.data.data as UserInfo;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await apiCall("POST", "/auth/change-password", passwordData);
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Use direct axios call to avoid interceptor loops
      const response = await authAxiosInstance.post("/auth/refresh-token", {
        refreshToken,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Refresh token failed");
      }

      const loginResponse = response.data.data as LoginResponse;

      // Update tokens in cookies
      const expiresAt = new Date(loginResponse.expiresAt);

      Cookies.set("accessToken", loginResponse.accessToken, {
        expires: expiresAt,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      Cookies.set("refreshToken", loginResponse.refreshToken, {
        expires: 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      Cookies.set("user", JSON.stringify(loginResponse.user), {
        expires: 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return loginResponse;
    } catch (error: any) {
      // Clear tokens on refresh failure
      if (
        error.response?.status === 401 ||
        error.message?.includes("invalid") ||
        error.message?.includes("expired")
      ) {
        this.clearAuthData();
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        // Use authAxiosInstance for logout to avoid interceptors
        await authAxiosInstance.post("/auth/revoke-token", { refreshToken });
      }
    } catch (error: any) {
      console.log("❌ AuthService: Token revocation failed:", error.message);
      // Continue with logout even if revocation fails
    } finally {
      // Clear all auth-related cookies
      this.clearAuthData();
    }
  }

  async revokeAllTokens(): Promise<void> {
    await apiCall("POST", "/auth/revoke-all-tokens");
    this.clearAuthData();
  }

  getCurrentUser(): UserInfo | null {
    try {
      const userCookie = Cookies.get("user");
      return userCookie ? JSON.parse(userCookie) : null;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    const token = Cookies.get("accessToken") || null;
    return token;
  }

  getRefreshToken(): string | null {
    const token = Cookies.get("refreshToken") || null;
    return token;
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.getAccessToken();
    return hasToken;
  }

  clearAuthData(): void {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
  }
}

export const authService = new AuthService();
