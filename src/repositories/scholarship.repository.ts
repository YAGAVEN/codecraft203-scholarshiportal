/**
 * Scholarship Repository
 * Handles all database operations related to scholarships
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { Scholarship, ScholarshipSearchCriteria } from '@/models';

export class ScholarshipRepository extends BaseRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  /**
   * Get all scholarships
   */
  async findAll(): Promise<Scholarship[]> {
    try {
      const { data, error } = await this.supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'ScholarshipRepository.findAll');
    }
  }

  /**
   * Get scholarship by ID
   */
  async findById(scholarshipId: string): Promise<Scholarship | null> {
    try {
      const { data, error } = await this.supabase
        .from('scholarships')
        .select('*')
        .eq('id', scholarshipId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error, 'ScholarshipRepository.findById');
    }
  }

  /**
   * Search scholarships with criteria
   */
  async search(criteria: ScholarshipSearchCriteria): Promise<Scholarship[]> {
    try {
      let query = this.supabase.from('scholarships').select('*');

      if (criteria.country) {
        query = query.eq('country', criteria.country);
      }

      if (criteria.language) {
        query = query.eq('language', criteria.language);
      }

      if (criteria.deadline_after) {
        query = query.gte('deadline', criteria.deadline_after);
      }

      if (criteria.search_term) {
        query = query.or(
          `title.ilike.%${criteria.search_term}%,description.ilike.%${criteria.search_term}%`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'ScholarshipRepository.search');
    }
  }

  /**
   * Get scholarships with upcoming deadlines
   */
  async findUpcoming(daysAhead: number = 30): Promise<Scholarship[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const { data, error } = await this.supabase
        .from('scholarships')
        .select('*')
        .gte('deadline', new Date().toISOString().split('T')[0])
        .lte('deadline', futureDate.toISOString().split('T')[0])
        .order('deadline', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'ScholarshipRepository.findUpcoming');
    }
  }
}
