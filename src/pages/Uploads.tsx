import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { Upload as UploadIcon, Download, Trash2, File, FileText, Image } from 'lucide-react';
import { FileUpload } from '../types';

export function Uploads() {
  const { currentSchool } = useSchool();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileUpload[]>(
    currentSchool ? storage.getFiles(currentSchool.id) : []
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || !currentSchool || !user) return;

    const newFiles: FileUpload[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          const fileData: FileUpload = {
            id: `file-${Date.now()}-${i}`,
            schoolId: currentSchool.id,
            name: file.name,
            type: file.type,
            size: file.size,
            data: reader.result as string,
            uploadedAt: new Date().toISOString(),
            uploadedBy: user.id,
          };
          newFiles.push(fileData);
          storage.addFile(currentSchool.id, fileData);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setFiles(storage.getFiles(currentSchool.id));
    e.target.value = '';
  };

  const handleDownload = (file: FileUpload) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const handleDelete = (fileId: string) => {
    if (currentSchool && confirm('Are you sure you want to delete this file?')) {
      storage.deleteFile(currentSchool.id, fileId);
      setFiles(storage.getFiles(currentSchool.id));
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-600" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    return <File className="w-8 h-8 text-slate-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!currentSchool) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No school selected</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">File Uploads</h1>
        <p className="text-slate-600 mt-2">Manage files and documents</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center">
            <UploadIcon className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 font-medium">Click to upload files</p>
            <p className="text-xs text-slate-500 mt-1">Support for images, PDFs, and documents</p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </label>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <UploadIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No files uploaded yet</h3>
          <p className="text-slate-600">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {file.type.startsWith('image/') && (
                <img
                  src={file.data}
                  alt={file.name}
                  className="mt-3 w-full h-32 object-cover rounded"
                />
              )}

              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
