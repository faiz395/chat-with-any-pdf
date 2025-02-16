"use client"

import React, { useCallback } from 'react'
  import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation';
import { Loader2Icon, Upload } from 'lucide-react';
import serviceClient from '@/appwriteClient';
import { useToast } from "@/hooks/use-toast"


// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { useRouter } from 'next/navigation';

// export default function FileUploader() {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number | null>(null);
//   const router = useRouter();

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
    
//     // File validation
//     if (!file) {
//       setError("Please select a file");
//       return;
//     }

//     if (file.type !== 'application/pdf') {
//       setError("Only PDF files are allowed");
//       return;
//     }

//     const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
//     if (file.size > MAX_FILE_SIZE) {
//       setError("File size must be less than 10MB");
//       return;
//     }

//     try {
//       setUploading(true);
//       setError(null);
//       setProgress(0);

//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setProgress(prev => {
//           if (prev === null || prev >= 90) return prev;
//           return prev + 10;
//         });
//       }, 500);

//       // Create FormData
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });
     
//       clearInterval(progressInterval);

//       // Check if response is JSON
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error('Server error: Invalid response format');
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.details || 'Upload failed');
//       }

//       setProgress(100);
//       console.log('🚀 Upload successful:', data);
      
//       // Optional: wait a bit to show 100% progress
//       await new Promise(resolve => setTimeout(resolve, 500));
//       router.push('/dashboard');

//     } catch (error: any) {
//       console.error('Upload error:', error);
//       setError(error.message || "Failed to upload file");
//       setProgress(null);
//     } finally {
//       setUploading(false);
//     }
//   }, [router]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'application/pdf': ['.pdf']
//     },
//     multiple: false
//   });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="w-full max-w-md">
//         <div 
//           {...getRootProps()} 
//           className={`
//             p-10 border-2 border-dashed rounded-lg text-center cursor-pointer 
//             ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
//             transition-colors duration-200
//           `}
//         >
//           <input {...getInputProps()} />
//           {uploading ? (
//             <div>
//               <p className="text-lg font-semibold mb-4">Uploading...</p>
//               {progress !== null && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div 
//                     className="bg-blue-600 h-2.5 rounded-full" 
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <p className="text-gray-600 mb-2">
//                 Drag 'n' drop a PDF file here, or click to select a file
//               </p>
//               <em className="text-xs text-gray-500">(Only *.pdf files will be accepted)</em>
//             </>
//           )}
//         </div>

//         {error && (
//           <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

function FileUploader() {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // File validation
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (file.type !== 'application/pdf') {
      setError("Only PDF files are allowed");
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev === null || prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
      // before calling the api 1st upload the file to appwrite
      const uploadedFile = await serviceClient.addNewPdfToBucket(file);
      if (!uploadedFile?.$id) {
        throw new Error("Failed to upload file to bucket");
      }
      console.log('✅ File uploaded successfully in frontend:', uploadedFile.$id);
      const fileId = uploadedFile.$id;

      // Create FormData
     
      // Create FormData with fileId
      const formData = new FormData();
      formData.append('fileId', fileId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: fileId,
      // });
     console.log("res is: ", response);
      
      clearInterval(progressInterval);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server error: Invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request. Please try again later.",
        })
        throw new Error(data.error || data.details || 'Upload failed');
      }

      setProgress(100);
      if(response?.ok){
        toast({
          title: "Success!",
          description: "Document uploaded successfully.",   
        })
      }
      console.log('Upload successful:', data);
      
      // Optional: wait a bit to show 100% progress
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/dashboard');
      // @ts-ignore
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || "Failed to upload file");
      setProgress(null);
    } finally {
      setUploading(false);
    }
  }, [router, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
      <div
        {...getRootProps()}
        className={`border-4 w-[100%] h-[100%] border-dashed rounded-lg transition-all duration-200 ease-in-out bg-indigo-50 ${
          isDragActive ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="min-h-screen w-full h-full flex flex-col justify-center items-center p-4">
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2Icon className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-500">Uploading PDF...</p>
              {progress !== null && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ) : isDragActive ? (
            <p className="text-indigo-600">Drop the PDF here...</p>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-gray-600">Drag and drop a PDF file here, or click to select one</p>
              <p className="text-sm text-gray-500">Only PDF files are accepted (max 10MB)</p>
            </>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
  );
}

export default FileUploader