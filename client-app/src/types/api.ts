// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

// Auth Types
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

export interface RefreshTokenRequest {
  refreshToken: string;
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

// Football Match Types
export interface FootballMatchRequest {
  date: string;
  time: string;
  stadium: string;
  matchNumber: number;
  type: string;
  totalRevenue: number;
  totalCost: number;
  recordingMoneyForPhotographer: number;
  moneyForCameraman: number;
  discount: number;
  status: string;
  note: string;
}

export interface FootballMatchResponse {
  id: string;
  date: string;
  time: string;
  stadium: string;
  matchNumber: number;
  type: string;
  totalRevenue: number;
  totalCost: number;
  recordingMoneyForPhotographer: number;
  moneyForCameraman: number;
  discount: number;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface FootballMatchFilter {
  fromDate?: string;
  toDate?: string;
  stadium?: string;
  status?: string;
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

// Calendar Event Types
export interface CalendarEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  color: string;
}

export interface CalendarEventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CalendarEventFilter {
  fromDate?: string;
  toDate?: string;
  type?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface PagedCalendarEvents {
  items: CalendarEventResponse[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
