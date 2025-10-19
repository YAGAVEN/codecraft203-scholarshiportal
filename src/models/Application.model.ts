/**
 * Application Model
 * Represents a scholarship application in the system
 */

export type ApplicationStatus = 'pending' | 'shortlisted' | 'selected' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: ApplicationStatus;
  applied_at: string;
  documents_submitted?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateApplicationInput {
  user_id: string;
  scholarship_id: string;
  status?: ApplicationStatus;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
}
