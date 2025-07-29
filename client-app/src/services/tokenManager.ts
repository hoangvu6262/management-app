// Centralized token refresh manager
class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;
  private lastRefreshTime = 0;
  private readonly REFRESH_COOLDOWN = 5000; // 5 seconds cooldown

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async refreshToken(): Promise<string> {
    const now = Date.now();

    // Check cooldown period
    if (now - this.lastRefreshTime < this.REFRESH_COOLDOWN) {
      throw new Error("Refresh token called too frequently");
    }

    // If already refreshing, return existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // If manually blocked
    if (this.isRefreshing) {
      throw new Error("Token refresh already in progress");
    }

    try {
      this.isRefreshing = true;
      this.lastRefreshTime = now;

      this.refreshPromise = this.performRefresh();
      const result = await this.refreshPromise;
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.refreshPromise = null;
      this.isRefreshing = false;
    }
  }

  private async performRefresh(): Promise<string> {
    const Cookies = (await import("js-cookie")).default;
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Import authAxiosInstance to avoid circular dependency
      const { authAxiosInstance } = await import("@/services/api");
      const response = await authAxiosInstance.post("/auth/refresh-token", {
        refreshToken,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Refresh token failed");
      }

      const loginResponse = response.data.data;

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

      return loginResponse.accessToken;
    } catch (error: any) {
      // If refresh token is invalid/expired, clear all auth data
      if (
        error.response?.status === 401 ||
        error.message?.includes("invalid") ||
        error.message?.includes("expired")
      ) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      }

      throw error;
    }
  }

  reset(): void {
    this.refreshPromise = null;
    this.isRefreshing = false;
    this.lastRefreshTime = 0;
  }

  canRefresh(): boolean {
    const now = Date.now();
    return (
      !this.isRefreshing &&
      !this.refreshPromise &&
      now - this.lastRefreshTime >= this.REFRESH_COOLDOWN
    );
  }
}

export const tokenManager = TokenManager.getInstance();
