import { apiClient } from './client';
import {
  CalendarEventRequest,
  CalendarEventResponse,
  CalendarEventFilter,
  PagedCalendarEvents,
  ApiResponse
} from '@/types/api';

export class CalendarEventService {
  static async create(data: CalendarEventRequest): Promise<ApiResponse<CalendarEventResponse>> {
    return apiClient.post<CalendarEventResponse>('/calendarevent', data);
  }

  static async update(id: string, data: CalendarEventRequest): Promise<ApiResponse<CalendarEventResponse>> {
    return apiClient.put<CalendarEventResponse>(`/calendarevent/${id}`, data);
  }

  static async delete(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/calendarevent/${id}`);
  }

  static async getById(id: string): Promise<ApiResponse<CalendarEventResponse>> {
    return apiClient.get<CalendarEventResponse>(`/calendarevent/${id}`);
  }

  static async getAll(filter?: CalendarEventFilter): Promise<ApiResponse<PagedCalendarEvents>> {
    return apiClient.get<PagedCalendarEvents>('/calendarevent', filter);
  }
}
