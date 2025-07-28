import { apiClient } from './client';
import {
  FootballMatchRequest,
  FootballMatchResponse,
  FootballMatchFilter,
  PagedFootballMatches,
  ApiResponse
} from '@/types/api';

export class FootballMatchService {
  static async create(data: FootballMatchRequest): Promise<ApiResponse<FootballMatchResponse>> {
    return apiClient.post<FootballMatchResponse>('/footballmatch', data);
  }

  static async update(id: string, data: FootballMatchRequest): Promise<ApiResponse<FootballMatchResponse>> {
    return apiClient.put<FootballMatchResponse>(`/footballmatch/${id}`, data);
  }

  static async delete(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/footballmatch/${id}`);
  }

  static async getById(id: string): Promise<ApiResponse<FootballMatchResponse>> {
    return apiClient.get<FootballMatchResponse>(`/footballmatch/${id}`);
  }

  static async getAll(filter?: FootballMatchFilter): Promise<ApiResponse<PagedFootballMatches>> {
    return apiClient.get<PagedFootballMatches>('/footballmatch', filter);
  }
}
