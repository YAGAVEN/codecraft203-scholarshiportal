/**
 * Scholarship Service
 * Business logic for scholarship management and matching
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScholarshipRepository } from '@/repositories/scholarship.repository';
import { UserRepository } from '@/repositories/user.repository';
import { Scholarship } from '@/models';
import {
  ScholarshipResponseDTO,
  ScholarshipListResponseDTO,
  MatchedScholarshipsResponseDTO,
} from '@/dtos';

export class ScholarshipService {
  private scholarshipRepo: ScholarshipRepository;
  private userRepo: UserRepository;

  constructor(supabase: SupabaseClient) {
    this.scholarshipRepo = new ScholarshipRepository(supabase);
    this.userRepo = new UserRepository(supabase);
  }

  /**
   * Get all scholarships
   */
  async getAllScholarships(): Promise<ScholarshipListResponseDTO> {
    const scholarships = await this.scholarshipRepo.findAll();

    return {
      scholarships: scholarships.map((s) => this.mapToDTO(s)),
      count: scholarships.length,
    };
  }

  /**
   * Get scholarship by ID
   */
  async getScholarshipById(scholarshipId: string): Promise<ScholarshipResponseDTO | null> {
    const scholarship = await this.scholarshipRepo.findById(scholarshipId);

    if (!scholarship) {
      return null;
    }

    return this.mapToDTO(scholarship);
  }

  /**
   * Get matched scholarships for user
   * This implements a simple matching algorithm based on user profile
   */
  async getMatchedScholarships(userId: string): Promise<MatchedScholarshipsResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allScholarships = await this.scholarshipRepo.findAll();

    // Simple matching logic based on economic background and profile completeness
    const matchedScholarships = allScholarships.filter(() => {
      // Prioritize users from economically disadvantaged backgrounds
      const economicMatch =
        user.economic_background === 'Below Poverty Line' ||
        user.economic_background === 'Low Income';

      // Check if profile is sufficiently complete
      const profileComplete = !!(
        user.name &&
        user.course &&
        user.category &&
        user.economic_background
      );

      // Match scholarships based on criteria
      // In a real-world scenario, this would be more sophisticated
      // involving NLP, keywords, and ML algorithms
      return economicMatch || (profileComplete && Math.random() > 0.3);
    });

    return {
      scholarships: matchedScholarships.map((s) => this.mapToDTO(s)),
      count: matchedScholarships.length,
    };
  }

  /**
   * Get upcoming scholarships with deadlines in the next N days
   */
  async getUpcomingScholarships(daysAhead: number = 30): Promise<ScholarshipListResponseDTO> {
    const scholarships = await this.scholarshipRepo.findUpcoming(daysAhead);

    return {
      scholarships: scholarships.map((s) => this.mapToDTO(s)),
      count: scholarships.length,
    };
  }

  /**
   * Search scholarships with filters
   */
  async searchScholarships(
    country?: string,
    language?: string,
    searchTerm?: string
  ): Promise<ScholarshipListResponseDTO> {
    const scholarships = await this.scholarshipRepo.search({
      country,
      language,
      search_term: searchTerm,
    });

    return {
      scholarships: scholarships.map((s) => this.mapToDTO(s)),
      count: scholarships.length,
    };
  }

  /**
   * Map Scholarship to DTO
   */
  private mapToDTO(scholarship: Scholarship): ScholarshipResponseDTO {
    return {
      id: scholarship.id,
      title: scholarship.title,
      description: scholarship.description,
      eligibility_criteria: scholarship.eligibility_criteria,
      deadline: scholarship.deadline,
      country: scholarship.country,
      language: scholarship.language,
      link: scholarship.link,
      created_at: scholarship.created_at,
    };
  }
}
