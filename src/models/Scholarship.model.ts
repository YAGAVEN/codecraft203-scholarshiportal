/**
 * Scholarship Model
 * Represents a scholarship opportunity in the system
 */

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  deadline: string;
  country: string;
  language: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScholarshipInput {
  title: string;
  description: string;
  eligibility_criteria: string;
  deadline: string;
  country: string;
  language: string;
  link: string;
}

export interface UpdateScholarshipInput {
  title?: string;
  description?: string;
  eligibility_criteria?: string;
  deadline?: string;
  country?: string;
  language?: string;
  link?: string;
}

export interface ScholarshipSearchCriteria {
  country?: string;
  language?: string;
  deadline_after?: string;
  search_term?: string;
}
