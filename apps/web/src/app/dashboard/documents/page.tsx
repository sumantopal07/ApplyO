'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { documentApi } from '@/lib/api';
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Loader2,
  Eye,
  X,
  File,
  FileImage,
  FileSpreadsheet,
} from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getAll();
      setDocuments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      try {
        const response = await documentApi.upload(formData);
        return response.data.data;
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r) => r !== null);

    if (successfulUploads.length > 0) {
      setDocuments((prev) => [...successfulUploads, ...prev]);
      toast.success(`Uploaded ${successfulUploads.length} file(s)`);
    }

    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentApi.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (type.includes('image')) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (type.includes('spreadsheet') || type.includes('excel'))
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const categories = [
    { value: 'all', label: 'All Documents' },
    { value: 'resume', label: 'Resumes' },
    { value: 'cover_letter', label: 'Cover Letters' },
    { value: 'certificate', label: 'Certificates' },
    { value: 'general', label: 'General' },
  ];

  const filteredDocuments = documents.filter(
    (doc) => selectedCategory === 'all' || doc.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input sm:w-48"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          card p-8 border-2 border-dashed cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto text-primary-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
          )}
          <p className="mt-4 text-lg font-medium text-gray-700">
            {isDragActive
              ? 'Drop files here...'
              : uploading
              ? 'Uploading...'
              : 'Drag & drop files here'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            or click to browse (PDF, DOC, DOCX, Images up to 10MB)
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">
            {selectedCategory !== 'all'
              ? 'No documents in this category'
              : 'No documents uploaded yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={handleDelete}
              getFileIcon={getFileIcon}
            />
          ))}
        </div>
      )}

      {/* Document Tips */}
      <div className="card p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">📁 Document Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your resume updated and in PDF format for best compatibility</li>
          <li>• Store multiple versions of cover letters for different roles</li>
          <li>• Upload certificates and credentials for quick access during applications</li>
          <li>• Companies requesting your profile can access shared documents</li>
        </ul>
      </div>
    </div>
  );
}

function DocumentCard({
  document,
  onDelete,
  getFileIcon,
}: {
  document: Document;
  onDelete: (id: string) => void;
  getFileIcon: (type: string) => React.ReactNode;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">{getFileIcon(document.type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate" title={document.name}>
              {document.name}
            </h4>
            <p className="text-sm text-gray-500">
              {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {document.category}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
          <button
            onClick={() => setShowPreview(true)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={document.url}
            download
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-4">
              {document.type.includes('pdf') ? (
                <iframe src={document.url} className="w-full h-full" title={document.name} />
              ) : document.type.includes('image') ? (
                <img
                  src={document.url}
                  alt={document.name}
                  className="max-w-full max-h-full mx-auto object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <File className="w-16 h-16 mx-auto text-gray-400" />
                    <p className="mt-4">Preview not available for this file type</p>
                    <a
                      href={document.url}
                      download
                      className="btn-primary mt-4 inline-flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download to view
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
