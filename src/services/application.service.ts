/**
 * Application Service
 * Business logic for scholarship applications
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ApplicationRepository } from '@/repositories/application.repository';
import { ScholarshipRepository } from '@/repositories/scholarship.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { Application, CreateApplicationInput } from '@/models';
import {
  ApplicationResponseDTO,
  ApplicationListResponseDTO,
  ApplicationSuccessResponseDTO,
} from '@/dtos';

export class ApplicationService {
  private applicationRepo: ApplicationRepository;
  private scholarshipRepo: ScholarshipRepository;
  private notificationRepo: NotificationRepository;

  constructor(supabase: SupabaseClient) {
    this.applicationRepo = new ApplicationRepository(supabase);
    this.scholarshipRepo = new ScholarshipRepository(supabase);
    this.notificationRepo = new NotificationRepository(supabase);
  }

  /**
   * Apply to a scholarship
   */
  async applyToScholarship(
    userId: string,
    scholarshipId: string
  ): Promise<ApplicationSuccessResponseDTO> {
    // Validate scholarship exists
    const scholarship = await this.scholarshipRepo.findById(scholarshipId);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }

    // Check if already applied
    const hasApplied = await this.applicationRepo.existsByUserAndScholarship(
      userId,
      scholarshipId
    );

    if (hasApplied) {
      throw new Error('Already applied to this scholarship');
    }

    // Create application
    const input: CreateApplicationInput = {
      user_id: userId,
      scholarship_id: scholarshipId,
      status: 'applied',
    };

    const application = await this.applicationRepo.create(input);

    // Create notification
    await this.notificationRepo.create({
      user_id: userId,
      message: `You have successfully applied to ${scholarship.title}`,
      is_read: false,
    });

    return {
      success: true,
      application: this.mapToDTO(application),
      message: 'Application submitted successfully',
    };
  }

  /**
   * Get all applications for a user
   */
  async getUserApplications(userId: string): Promise<ApplicationListResponseDTO> {
    const applications = await this.applicationRepo.findByUserId(userId);

    return {
      applications: applications.map((app) => this.mapToDTO(app)),
      total: applications.length,
    };
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string): Promise<ApplicationResponseDTO | null> {
    const application = await this.applicationRepo.findById(applicationId);

    if (!application) {
      return null;
    }

    return this.mapToDTO(application);
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,
    status: 'applied' | 'pending' | 'accepted' | 'rejected'
  ): Promise<ApplicationResponseDTO> {
    const application = await this.applicationRepo.update(applicationId, { status });

    return this.mapToDTO(application);
  }

  /**
   * Map Application to DTO
   */
  private mapToDTO(application: Application): ApplicationResponseDTO {
    return {
      id: application.id,
      user_id: application.user_id,
      scholarship_id: application.scholarship_id,
      status: application.status,
      applied_at: application.applied_at,
    };
  }
}
