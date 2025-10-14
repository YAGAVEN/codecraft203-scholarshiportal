/**
 * Readiness Service
 * Business logic for calculating user application readiness score
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { UserRepository } from '@/repositories/user.repository';
import { ApplicationRepository } from '@/repositories/application.repository';
import { ReadinessScoreResponseDTO, ReadinessFactor, ReadinessStatus } from '@/dtos';

export class ReadinessService {
  private userRepo: UserRepository;
  private applicationRepo: ApplicationRepository;

  constructor(supabase: SupabaseClient) {
    this.userRepo = new UserRepository(supabase);
    this.applicationRepo = new ApplicationRepository(supabase);
  }

  /**
   * Calculate readiness score for a user
   * @param documentScore - Optional document score from client-side localStorage (0-30)
   */
  async calculateReadinessScore(userId: string, documentScore: number = 0): Promise<ReadinessScoreResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let totalScore = 0;
    const factors: ReadinessFactor[] = [];

    // Factor 1: Profile Completeness (40 points)
    const profileScore = this.calculateProfileScore(user);
    factors.push({
      name: 'Profile Completeness',
      score: profileScore,
      maxScore: 40,
    });
    totalScore += profileScore;

    // Factor 2: Applications Submitted (30 points)
    const applicationCount = await this.applicationRepo.countByUserId(userId);
    const applicationScore = Math.min(30, applicationCount * 10);
    factors.push({
      name: 'Applications Submitted',
      score: applicationScore,
      maxScore: 30,
    });
    totalScore += applicationScore;

    // Factor 3: Documents Uploaded (30 points)
    // Document score is passed from client-side localStorage
    const docScore = Math.min(30, Math.max(0, documentScore)); // Ensure between 0-30
    factors.push({
      name: 'Documents Uploaded',
      score: docScore,
      maxScore: 30,
    });
    totalScore += docScore;

    // Calculate percentage
    const readinessPercentage = Math.round((totalScore / 100) * 100);

    // Determine status
    const status = this.getReadinessStatus(readinessPercentage);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      profileScore,
      applicationCount,
      docScore
    );

    return {
      score: readinessPercentage,
      status,
      factors,
      recommendations,
      applicationCount,
    };
  }

  /**
   * Calculate profile completeness score
   */
  private calculateProfileScore(user: { 
    name?: string; 
    email?: string; 
    course?: string; 
    category?: string; 
    economic_background?: string 
  }): number {
    let score = 0;
    if (user.name) score += 8;
    if (user.email) score += 8;
    if (user.course) score += 8;
    if (user.category) score += 8;
    if (user.economic_background) score += 8;
    return score;
  }

  /**
   * Determine readiness status based on score
   */
  private getReadinessStatus(percentage: number): ReadinessStatus {
    if (percentage < 20) return 'Not Ready';
    if (percentage < 40) return 'Getting Started';
    if (percentage < 60) return 'In Progress';
    if (percentage < 80) return 'Almost Ready';
    return 'Ready';
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    profileScore: number,
    applicationCount: number,
    documentScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (profileScore < 40) {
      recommendations.push('Complete your profile information to improve your match accuracy');
    }

    if (applicationCount === 0) {
      recommendations.push('Apply to your first scholarship to get started');
    } else if (applicationCount < 3) {
      recommendations.push('Apply to more scholarships to increase your chances');
    }

    if (documentScore < 30) {
      recommendations.push('Upload required documents (transcripts, CV, recommendation letters)');
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job! Keep applying and tracking your applications');
    }

    return recommendations;
  }
}
