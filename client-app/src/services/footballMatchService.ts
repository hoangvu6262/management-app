import { apiCall, isAuthenticated } from "./api";

export interface CreateFootballMatchRequest {
  date: string;
  time: string; // HH:mm format
  stadium: string;
  team: string;
  matchNumber: number;
  type: "S5" | "S7" | "S11";
  totalRevenue: number;
  totalCost: number;
  recordingMoneyForPhotographer: number;
  moneyForCameraman: number;
  discount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  note: string;
}

export interface UpdateFootballMatchRequest
  extends CreateFootballMatchRequest {}

export interface UpdateStatusRequest {
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

export interface FootballMatchResponse {
  id: string;
  date: string;
  time: string;
  stadium: string;
  team: string;
  matchNumber: number;
  type: "S5" | "S7" | "S11";
  totalRevenue: number;
  totalCost: number;
  recordingMoneyForPhotographer: number;
  moneyForCameraman: number;
  discount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  note: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // Calculated field
  profit?: number;
}

export interface FootballMatchFilter {
  fromDate?: string;
  toDate?: string;
  stadium?: string;
  team?: string;
  searchText?: string;
  status?: string;
  type?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface PagedFootballMatches {
  items: FootballMatchResponse[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

class FootballMatchService {
  async getAll(
    filter: FootballMatchFilter = {}
  ): Promise<PagedFootballMatches> {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = `/footballmatch${queryString ? `?${queryString}` : ""}`;

    const response = await apiCall<PagedFootballMatches>("GET", url);

    // Calculate profit for each match
    response.items = response.items.map((match) => ({
      ...match,
      profit: this.calculateProfit(match),
    }));

    return response;
  }

  async getById(id: string): Promise<FootballMatchResponse> {
    const response = await apiCall<FootballMatchResponse>(
      "GET",
      `/footballmatch/${id}`
    );
    return {
      ...response,
      profit: this.calculateProfit(response),
    };
  }

  async create(
    data: CreateFootballMatchRequest
  ): Promise<FootballMatchResponse> {
    const response = await apiCall<FootballMatchResponse>(
      "POST",
      "/footballmatch",
      data
    );
    return {
      ...response,
      profit: this.calculateProfit(response),
    };
  }

  async update(
    id: string,
    data: UpdateFootballMatchRequest
  ): Promise<FootballMatchResponse> {
    const response = await apiCall<FootballMatchResponse>(
      "PUT",
      `/footballmatch/${id}`,
      data
    );
    return {
      ...response,
      profit: this.calculateProfit(response),
    };
  }

  async updateStatus(
    id: string,
    status: "PENDING" | "COMPLETED" | "CANCELLED"
  ): Promise<FootballMatchResponse> {
    const response = await apiCall<FootballMatchResponse>(
      "PATCH",
      `/footballmatch/${id}/status`,
      { status }
    );
    return {
      ...response,
      profit: this.calculateProfit(response),
    };
  }

  async delete(id: string): Promise<void> {
    await apiCall("DELETE", `/footballmatch/${id}`);
  }

  // Calculate profit: Total Revenue - Total Cost - Recording Money - Cameraman Money - Discount
  private calculateProfit(match: FootballMatchResponse): number {
    return (
      match.totalRevenue -
      match.totalCost -
      match.recordingMoneyForPhotographer -
      match.moneyForCameraman -
      match.discount
    );
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return amount.toLocaleString("vi-VN");
  }

  // Helper method to get status style (inline styles)
  getStatusStyle(status: string): {
    backgroundColor: string;
    color: string;
    borderColor: string;
  } {
    switch (status) {
      case "COMPLETED":
        return {
          backgroundColor: "#dcfce7", // green-100
          color: "#166534", // green-800
          borderColor: "#dcfce7", // green-300
        };
      case "PENDING":
        return {
          backgroundColor: "#e9d5ff", // purple-100
          color: "#5b21b6", // purple-800
          borderColor: "#e9d5ff", // purple-300
        };
      case "CANCELLED":
        return {
          backgroundColor: "#fecaca", // red-100
          color: "#991b1b", // red-800
          borderColor: "#fecaca", // red-300
        };
      default:
        return {
          backgroundColor: "#f3f4f6", // gray-100
          color: "#1f2937", // gray-800
          borderColor: "#d1d5db", // gray-300
        };
    }
  }

  // Helper method to get profit color
  getProfitColor(profit: number): string {
    if (profit > 0) {
      return "text-green-600 dark:text-green-400";
    } else if (profit < 0) {
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-600 dark:text-gray-400";
  }

  // Helper method to get type options
  getTypeOptions() {
    return [
      { value: "S5", label: "Sân 5" },
      { value: "S7", label: "Sân 7" },
      { value: "S11", label: "Sân 11" },
    ];
  }

  // Helper method to format time
  formatTime(time: string): string {
    return time; // Already in HH:mm format
  }

  // Helper method to get current time in HH:mm format
  getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:mm
  }
}

export const footballMatchService = new FootballMatchService();
