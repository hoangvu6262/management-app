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
    const { authService } = await import("@/services/authService");
    const response = await authService.refreshToken();
    return response.accessToken;
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
