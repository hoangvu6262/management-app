import useSWR, { SWRConfiguration, mutate } from 'swr';
import { footballMatchService, FootballMatchFilter, PagedFootballMatches, FootballMatchResponse } from '@/services/footballMatchService';

// SWR keys for football matches
export const FOOTBALL_MATCH_KEYS = {
  all: (filter?: FootballMatchFilter) => {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    return ['football-matches', params.toString()];
  },
  detail: (id: string) => ['football-match', id],
};

// Hook to get all football matches with filter
export function useFootballMatches(filter?: FootballMatchFilter, config?: SWRConfiguration) {
  const key = FOOTBALL_MATCH_KEYS.all(filter);
  
  const { data, error, isLoading, mutate: mutateSelf } = useSWR(
    key,
    () => footballMatchService.getAll(filter),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...config,
    }
  );

  return {
    data: data as PagedFootballMatches | undefined,
    error,
    isLoading,
    mutate: mutateSelf,
    // Global mutate for all football matches
    mutateAll: () => mutate((key) => Array.isArray(key) && key[0] === 'football-matches'),
  };
}

// Hook to get single football match
export function useFootballMatch(id: string, config?: SWRConfiguration) {
  const key = FOOTBALL_MATCH_KEYS.detail(id);
  
  const { data, error, isLoading, mutate: mutateSelf } = useSWR(
    id ? key : null,
    () => footballMatchService.getById(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...config,
    }
  );

  return {
    data: data as FootballMatchResponse | undefined,
    error,
    isLoading,
    mutate: mutateSelf,
  };
}

// Football match mutations
export const footballMatchMutations = {
  // Create new football match
  async create(data: any) {
    const newMatch = await footballMatchService.create(data);
    
    // Mutate all lists to refresh them
    mutate((key) => Array.isArray(key) && key[0] === 'football-matches');
    
    return newMatch;
  },

  // Update football match
  async update(id: string, data: any) {
    const updatedMatch = await footballMatchService.update(id, data);
    
    // Mutate specific match and all lists
    mutate(FOOTBALL_MATCH_KEYS.detail(id));
    mutate((key) => Array.isArray(key) && key[0] === 'football-matches');
    
    return updatedMatch;
  },

  // Delete football match
  async delete(id: string) {
    await footballMatchService.delete(id);
    
    // Mutate all lists to refresh them
    mutate((key) => Array.isArray(key) && key[0] === 'football-matches');
  },
};
