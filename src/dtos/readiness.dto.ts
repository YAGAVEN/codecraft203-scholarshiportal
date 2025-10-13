/**
 * Readiness DTOs
 * Data Transfer Objects for Readiness Score related responses
 */

export interface ReadinessFactor {
  name: string;
  score: number;
  maxScore: number;
}

export type ReadinessStatus = 
  | 'Not Ready' 
  | 'Getting Started' 
  | 'In Progress' 
  | 'Almost Ready' 
  | 'Ready';

export interface ReadinessScoreResponseDTO {
  score: number;
  status: ReadinessStatus;
  factors: ReadinessFactor[];
  recommendations: string[];
  applicationCount: number;
}
