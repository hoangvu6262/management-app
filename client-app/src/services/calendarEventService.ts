import { apiCall } from './api';

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  date: string;
  time: string; // HH:MM format
  type: 'meeting' | 'task' | 'reminder' | 'other';
  color?: string;
}

export interface UpdateCalendarEventRequest extends CreateCalendarEventRequest {}

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

class CalendarEventService {
  async getAll(filter: CalendarEventFilter = {}): Promise<PagedCalendarEvents> {
    const params = new URLSearchParams();
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = `/calendarevent${queryString ? `?${queryString}` : ''}`;
    
    return await apiCall<PagedCalendarEvents>('GET', url);
  }

  async getById(id: string): Promise<CalendarEventResponse> {
    return await apiCall<CalendarEventResponse>('GET', `/calendarevent/${id}`);
  }

  async create(data: CreateCalendarEventRequest): Promise<CalendarEventResponse> {
    // Convert time to TimeSpan format for API
    const payload = {
      ...data,
      time: this.convertTimeToTimeSpan(data.time)
    };
    
    return await apiCall<CalendarEventResponse>('POST', '/calendarevent', payload);
  }

  async update(id: string, data: UpdateCalendarEventRequest): Promise<CalendarEventResponse> {
    // Convert time to TimeSpan format for API
    const payload = {
      ...data,
      time: this.convertTimeToTimeSpan(data.time)
    };
    
    return await apiCall<CalendarEventResponse>('PUT', `/calendarevent/${id}`, payload);
  }

  async delete(id: string): Promise<void> {
    await apiCall('DELETE', `/calendarevent/${id}`);
  }

  // Convert HH:MM to TimeSpan format (HH:MM:SS)
  private convertTimeToTimeSpan(time: string): string {
    if (time.includes(':') && time.split(':').length === 2) {
      return `${time}:00`;
    }
    return time;
  }

  // Convert TimeSpan format back to HH:MM for display
  convertTimeSpanToTime(timeSpan: string): string {
    if (timeSpan.includes(':')) {
      const parts = timeSpan.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return timeSpan;
  }

  // Helper method to get type color
  getTypeColor(type: string): string {
    switch (type) {
      case 'meeting':
        return '#3B82F6'; // Blue
      case 'task':
        return '#F59E0B'; // Orange
      case 'reminder':
        return '#EF4444'; // Red
      case 'other':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  }

  // Helper method to get type label
  getTypeLabel(type: string): string {
    switch (type) {
      case 'meeting':
        return 'Meeting';
      case 'task':
        return 'Task';
      case 'reminder':
        return 'Reminder';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  }

  // Helper method to format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Helper method to format time for display
  formatTime(timeSpan: string): string {
    const time = this.convertTimeSpanToTime(timeSpan);
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${period}`;
  }

  // Helper method to get events for a specific date
  getEventsForDate(events: CalendarEventResponse[], date: Date): CalendarEventResponse[] {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date.startsWith(dateString));
  }

  // Helper method to sort events by time
  sortEventsByTime(events: CalendarEventResponse[]): CalendarEventResponse[] {
    return [...events].sort((a, b) => {
      const timeA = this.convertTimeSpanToTime(a.time);
      const timeB = this.convertTimeSpanToTime(b.time);
      return timeA.localeCompare(timeB);
    });
  }
}

export const calendarEventService = new CalendarEventService();
