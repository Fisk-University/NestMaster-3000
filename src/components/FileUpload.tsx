import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const UPLOAD_URL = 'https://xun5g3wlebzfdmzpcpyto35no40arnvg.lambda-url.us-east-1.on.aws/';
const PROCESS_URL = 'https://zowh2bdqqerywtiy5tqqeyembi0ysqlv.lambda-url.us-east-1.on.aws/';

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const uploadFile = async (url: string, file: File, fileName: string) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: percentCompleted
        }));
      }
    });

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    setStatusMessage('Starting upload...');

    try {
      // Get upload URLs
      const urlResponse = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: files.map(f => ({
            name: f.name,
            type: f.type,
            size: f.size
          }))
        })
      });

      if (!urlResponse.ok) throw new Error('Failed to get upload URLs');
      
      const { uploadUrls, folder } = await urlResponse.json();

      // Upload files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, fileName } = uploadUrls[i];

        await uploadFile(url, file, fileName);
      }

      // Process files
      setStatusMessage('Processing files...');
      const processResponse = await fetch(PROCESS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
      });

      if (!processResponse.ok) throw new Error('Failed to process files');

      const { downloadUrl } = await processResponse.json();
      setStatusMessage('Complete! Downloading...');
      window.location.href = downloadUrl;

    } catch (err) {
      setStatusMessage(`Error: ${err instanceof Error ? err.message : 'Upload failed'}`);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="card-title">Rosenwald NestMaster 3000</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              disabled={isUploading}
              className="input-button text-sm text-gray-500"
            />
          </div>
          <br></br><br></br>
          <p className="mt-2 text-sm text-gray-500 instructions">
            Drag and drop or Click to upload
          </p>
          <p className="mt-2 text-sm text-gray-500 instructions">
            Upload a ZIP <br></br><b>OR</b><br></br> CSV file + images (PDF, JPG, JPEG, PNG)
          </p>
          <p className="mt-2 text-sm text-gray-500 instructions">
            Refresh page between uploads if upload fails
          </p>
        </div>

        {statusMessage && (
          <p className="mt-4 text-sm text-blue-500">{statusMessage}</p>
        )}

        {Object.entries(uploadProgress).map(([fileName, progress]) => (
          <div key={fileName} className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{fileName}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FileUpload;