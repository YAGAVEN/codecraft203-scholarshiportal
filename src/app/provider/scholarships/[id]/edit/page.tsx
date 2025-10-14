import { Suspense } from 'react';
import EditScholarshipContent from './edit-scholarship-content';

export default function EditScholarshipPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <EditScholarshipContent />
    </Suspense>
  );
}
