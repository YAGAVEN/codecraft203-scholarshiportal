export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'provider' | 'admin';
  course?: string;
  category?: string;
  economic_background?: string;
  profile_completeness?: number;
  documents_uploaded?: number;
  created_at?: string;
}

export interface Scholarship {
  id: string;
  provider_id?: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  benefits?: string;
  required_documents?: string;
  deadline: string;
  country: string;
  language: string;
  link: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: 'pending' | 'shortlisted' | 'selected' | 'rejected';
  documents_submitted?: string;
  applied_at: string;
  updated_at?: string;
  scholarship?: Scholarship;
  user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  profile_completeness: number;
  documents_uploaded: number;
}
