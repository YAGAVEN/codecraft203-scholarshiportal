'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, X } from 'lucide-react';
import { 
  getStoredDocuments, 
  saveDocuments, 
  calculateDocumentScore as calcDocScore,
  getDocumentCategories,
  type UploadedDocument 
} from '@/lib/documentUtils';

const DOCUMENT_CATEGORIES = getDocumentCategories();

interface Props {
  userId: string;
  onDocumentsChange?: (documents: UploadedDocument[]) => void;
}

export default function DocumentUploader({ userId, onDocumentsChange }: Props) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('transcript');
  const [uploading, setUploading] = useState(false);

  // Load documents from localStorage on mount
  const loadDocuments = useCallback(() => {
    const docs = getStoredDocuments(userId);
    setDocuments(docs);
    onDocumentsChange?.(docs);
  }, [userId, onDocumentsChange]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const updateDocuments = (docs: UploadedDocument[]) => {
    saveDocuments(userId, docs);
    setDocuments(docs);
    onDocumentsChange?.(docs);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const file = files[0];
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock document entry
      const newDoc: UploadedDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        category: selectedCategory as UploadedDocument['category'],
      };

      const updatedDocs = [...documents, newDoc];
      updateDocuments(updatedDocs);

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (docId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    updateDocuments(updatedDocs);
  };

  const calculateDocumentScore = () => {
    return calcDocScore(userId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const documentScore = calculateDocumentScore();
  const scorePercentage = Math.round((documentScore / 30) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload documents to increase your readiness score (up to 30 points)
            </CardDescription>
          </div>
          <Badge variant={documentScore >= 20 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
            {documentScore}/30 pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              disabled={uploading}
            >
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.points} pts)
                </option>
              ))}
            </select>

            <label className="flex-1">
              <Button 
                type="button" 
                disabled={uploading}
                className="w-full relative cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </span>
              </Button>
            </label>
          </div>

          <p className="text-xs text-muted-foreground">
            Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
          </p>
        </div>

        {/* Document Score Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Document Score Progress</span>
            <span className="text-muted-foreground">{scorePercentage}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                documentScore >= 20 ? 'bg-green-500' : 
                documentScore >= 10 ? 'bg-blue-500' : 
                'bg-amber-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>

        {/* Points Guide */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Points Guide:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {DOCUMENT_CATEGORIES.map(cat => (
              <div key={cat.value} className="flex items-center gap-1">
                <span className="text-muted-foreground">•</span>
                <span>{cat.label}: <strong>{cat.points} pts</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Uploaded Documents ({documents.length})
            </h4>
            <div className="space-y-2">
              {documents.map(doc => {
                const category = DOCUMENT_CATEGORIES.find(cat => cat.value === doc.category);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {category?.label}
                          </Badge>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        +{category?.points} pts
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="ml-2 flex-shrink-0 h-8 w-8"
                      title="Delete document"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {documents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs mt-1">Upload documents to boost your readiness score</p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips to maximize your score:
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>Upload your academic transcript for maximum points (10 pts)</li>
            <li>Add a professional CV/Resume (8 pts)</li>
            <li>Include recommendation letters if available (7 pts each)</li>
            <li>Upload certificates to showcase your achievements (3 pts each)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
