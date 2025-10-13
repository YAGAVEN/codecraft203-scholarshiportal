/**
 * Scholarship DTOs
 * Data Transfer Objects for Scholarship-related requests and responses
 */

export interface ScholarshipResponseDTO {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  deadline: string;
  country: string;
  language: string;
  link: string;
  created_at?: string;
}

export interface ScholarshipListResponseDTO {
  scholarships: ScholarshipResponseDTO[];
  count: number;
}

export interface MatchedScholarshipsResponseDTO {
  scholarships: ScholarshipResponseDTO[];
  count: number;
  match_score?: number;
}
