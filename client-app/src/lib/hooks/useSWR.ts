import useSWR from 'swr';
import { FootballMatchService, CalendarEventService } from '@/lib/api';
import { FootballMatchFilter, CalendarEventFilter } from '@/types/api';

// Football Match Hooks
export function useFootballMatches(filter?: FootballMatchFilter) {
  const { data, error, isLoading, mutate } = useSWR(
    ['footballMatches', filter],
    () => FootballMatchService.getAll(filter),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    success: data?.success
  };
}

export function useFootballMatch(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['footballMatch', id] : null,
    () => FootballMatchService.getById(id),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    success: data?.success
  };
}

// Calendar Event Hooks
export function useCalendarEvents(filter?: CalendarEventFilter) {
  const { data, error, isLoading, mutate } = useSWR(
    ['calendarEvents', filter],
    () => CalendarEventService.getAll(filter),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    success: data?.success
  };
}

export function useCalendarEvent(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['calendarEvent', id] : null,
    () => CalendarEventService.getById(id),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
    success: data?.success
  };
}
