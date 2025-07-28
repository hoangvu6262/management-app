import useSWR, { SWRConfiguration, mutate } from 'swr';
import { calendarEventService, CalendarEventFilter, PagedCalendarEvents, CalendarEventResponse } from '@/services/calendarEventService';

// SWR keys for calendar events
export const CALENDAR_EVENT_KEYS = {
  all: (filter?: CalendarEventFilter) => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return ['calendar-events', params.toString()];
  },
  detail: (id: string) => ['calendar-event', id],
};

// Hook to get all calendar events with filter
export function useCalendarEvents(filter?: CalendarEventFilter, config?: SWRConfiguration) {
  const key = CALENDAR_EVENT_KEYS.all(filter);
  
  const { data, error, isLoading, mutate: mutateSelf } = useSWR(
    key,
    () => calendarEventService.getAll(filter),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...config,
    }
  );

  return {
    data: data as PagedCalendarEvents | undefined,
    error,
    isLoading,
    mutate: mutateSelf,
    // Global mutate for all calendar events
    mutateAll: () => mutate((key) => Array.isArray(key) && key[0] === 'calendar-events'),
  };
}

// Hook to get single calendar event
export function useCalendarEvent(id: string, config?: SWRConfiguration) {
  const key = CALENDAR_EVENT_KEYS.detail(id);
  
  const { data, error, isLoading, mutate: mutateSelf } = useSWR(
    id ? key : null,
    () => calendarEventService.getById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...config,
    }
  );

  return {
    data: data as CalendarEventResponse | undefined,
    error,
    isLoading,
    mutate: mutateSelf,
  };
}

// Hook to get events for calendar view (without pagination)
export function useCalendarEventsForView(filter?: CalendarEventFilter, config?: SWRConfiguration) {
  const largePageFilter = { ...filter, pageSize: 1000, page: 1 }; // Get all events for calendar view
  const key = CALENDAR_EVENT_KEYS.all(largePageFilter);
  
  const { data, error, isLoading, mutate: mutateSelf } = useSWR(
    key,
    () => calendarEventService.getAll(largePageFilter),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...config,
    }
  );

  return {
    data: data?.items || [],
    error,
    isLoading,
    mutate: mutateSelf,
    mutateAll: () => mutate((key) => Array.isArray(key) && key[0] === 'calendar-events'),
  };
}

// Calendar event mutations
export const calendarEventMutations = {
  // Create new calendar event
  async create(data: any) {
    const newEvent = await calendarEventService.create(data);
    
    // Mutate all lists to refresh them
    mutate((key) => Array.isArray(key) && key[0] === 'calendar-events');
    
    return newEvent;
  },

  // Update calendar event
  async update(id: string, data: any) {
    const updatedEvent = await calendarEventService.update(id, data);
    
    // Mutate specific event and all lists
    mutate(CALENDAR_EVENT_KEYS.detail(id));
    mutate((key) => Array.isArray(key) && key[0] === 'calendar-events');
    
    return updatedEvent;
  },

  // Delete calendar event
  async delete(id: string) {
    await calendarEventService.delete(id);
    
    // Mutate all lists to refresh them
    mutate((key) => Array.isArray(key) && key[0] === 'calendar-events');
  },
};
