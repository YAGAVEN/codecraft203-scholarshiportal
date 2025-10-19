import { Suspense } from 'react';
import ViewScholarshipContent from './view-scholarship-content';

export default function ViewScholarshipPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <ViewScholarshipContent />
    </Suspense>
  );
}
