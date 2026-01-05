'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import clsx from 'clsx';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onUploadStart: () => void;
  onUploadEnd: () => void;
}

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Automatically trigger upload for new files
    for (const fileObj of newFiles) {
      await uploadFile(fileObj);
    }
  }, []);

  const uploadFile = async (fileObj: UploadedFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.file === fileObj.file ? { ...f, status: 'uploading' } : f
      )
    );

    const formData = new FormData();
    formData.append('file', fileObj.file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileObj.file ? { ...f, status: 'success' } : f
        )
      );
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileObj.file ? { ...f, status: 'error', message: 'Failed' } : f
        )
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>File Upload</h2>
      <div
        {...getRootProps()}
        className={clsx(styles.dropzone, { [styles.active]: isDragActive })}
      >
        <input {...getInputProps()} />
        <div className={styles.icon}>📁</div>
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop files here, or click to select files</p>
        )}
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.5 }}>
          Supports: txt, images, pdf, docx
        </p>
      </div>

      <div className={styles.fileList}>
        {files.map((fileObj, index) => (
          <div key={`${fileObj.file.name}-${index}`} className={styles.fileItem}>
            <div className={styles.fileName}>{fileObj.file.name}</div>
            <div className={styles.fileSize}>
              {(fileObj.file.size / 1024).toFixed(2)} KB
            </div>
            <div
              className={clsx(styles.status, {
                [styles.uploading]: fileObj.status === 'uploading',
                [styles.success]: fileObj.status === 'success',
                [styles.error]: fileObj.status === 'error',
              })}
            >
              {fileObj.status === 'pending' && 'Pending'}
              {fileObj.status === 'uploading' && 'Uploading...'}
              {fileObj.status === 'success' && 'Done'}
              {fileObj.status === 'error' && (fileObj.message || 'Error')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
