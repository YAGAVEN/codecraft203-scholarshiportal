/**
 * Document utilities for managing uploaded documents in localStorage
 */

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  category: 'transcript' | 'cv' | 'recommendation' | 'certificate' | 'other';
}

const DOCUMENT_CATEGORIES = [
  { value: 'transcript', label: 'Academic Transcript', points: 10 },
  { value: 'cv', label: 'CV/Resume', points: 8 },
  { value: 'recommendation', label: 'Recommendation Letter', points: 7 },
  { value: 'certificate', label: 'Certificate', points: 3 },
  { value: 'other', label: 'Other Document', points: 2 },
] as const;

const STORAGE_KEY = 'uploaded_documents';

/**
 * Get stored documents for a user from localStorage
 */
export function getStoredDocuments(userId: string): UploadedDocument[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting stored documents:', error);
    return [];
  }
}

/**
 * Calculate document score for a user (0-30 points)
 */
export function calculateDocumentScore(userId: string): number {
  const documents = getStoredDocuments(userId);
  let totalScore = 0;
  const maxScore = 30;

  documents.forEach(doc => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.value === doc.category);
    if (category) {
      totalScore += category.points;
    }
  });

  return Math.min(totalScore, maxScore);
}

/**
 * Save documents to localStorage
 */
export function saveDocuments(userId: string, documents: UploadedDocument[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(documents));
  } catch (error) {
    console.error('Error saving documents:', error);
  }
}

/**
 * Get document categories with points
 */
export function getDocumentCategories() {
  return DOCUMENT_CATEGORIES;
}
