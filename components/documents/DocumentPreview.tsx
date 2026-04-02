import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { prisma } from '../../lib/db/prisma';

interface Document {
  id: string;
  name: string;
  category: string;
  status: string;
  progress: number;
}

export function DocumentPreview() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const { data: session } = useSession();

  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    setPreviewContent('Loading preview...');
    // Simulate loading preview
    setTimeout(() => {
      setPreviewContent(getPreviewContent(doc));
    }, 500);
  };

  const getPreviewContent = (doc: Document) => {
    switch (doc.category) {
      case 'passport':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-white mb-2">Passport Preview</h3>
            <p className="text-sm text-gray-400">Passport Number: X1234567</p>
            <p className="text-sm text-gray-400">Name: John Doe</p>
            <p className="text-sm text-gray-400">Nationality: American</p>
            <p className="text-sm text-gray-400">Expiry: 2025-12-31</p>
          </div>
        );
      case 'bank_statement':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-white mb-2">Bank Statement Preview</h3>
            <p className="text-sm text-gray-400">Account: 1234-5678-9012</p>
            <p className="text-sm text-gray-400">Balance: $5,230.45</p>
            <p className="text-sm text-gray-400">Transactions: 24</p>
            <p className="text-sm text-gray-400">Period: Jan-Mar 2024</p>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-white mb-2">Document Preview</h3>
            <p className="text-sm text-gray-400">Name: {doc.name}</p>
            <p className="text-sm text-gray-400">Category: {doc.category.replace('_', ' ')}</p>
            <p className="text-sm text-gray-400">Status: {doc.status}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gold-500 transition-colors">
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-gray-400 mb-1">Select a document to preview</p>
      </div>

      {selectedDocument && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">Document Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedDocument.name}</p>
                  <p className="text-xs text-gray-400">{selectedDocument.category.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedDocument.progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {selectedDocument.status === 'completed' ? 'Done' : `${selectedDocument.progress}%`}
                </span>
              </div>
            </div>
            {previewContent}
          </div>
        </div>
      )}
    </div>
  );
}