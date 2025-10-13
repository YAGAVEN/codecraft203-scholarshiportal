/**
 * Application DTOs
 * Data Transfer Objects for Application-related requests and responses
 */

import { ApplicationStatus } from '@/models';

export interface CreateApplicationDTO {
  scholarship_id: string;
}

export interface ApplicationResponseDTO {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: ApplicationStatus;
  applied_at: string;
}

export interface ApplicationListResponseDTO {
  applications: ApplicationResponseDTO[];
  total: number;
}

export interface ApplicationSuccessResponseDTO {
  success: boolean;
  application: ApplicationResponseDTO;
  message: string;
}
