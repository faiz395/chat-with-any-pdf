"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewProps {
  url?: string;
  fileId?: string;
}

function PdfView({ url, fileId }: PdfViewProps) {
  const [numPages, setNumPages] = useState<number | undefined>();
  const [file, setFile] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [initialPagesLoaded, setInitialPagesLoaded] = useState(false);
  console.log("PdfView",pdfUrl);
  console.log("rotation",rotation)
  useEffect(() => {
    const fetchFile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let finalUrl = url;
        if (fileId && !url) {
          finalUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        }

        if (!finalUrl) {
          throw new Error("No URL provided");
        }

        setPdfUrl(finalUrl);
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        setFile(blob);
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [url, fileId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setInitialPagesLoaded(true);
  }

  const rotate = () => setRotation((prev) => (prev + 90) % 360);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex space-x-2 mb-4">
        <Button onClick={rotate} variant="outline" size="icon">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button onClick={zoomIn} variant="outline" size="icon">
          <ZoomInIcon className="h-4 w-4" />
        </Button>
        <Button onClick={zoomOut} variant="outline" size="icon">
          <ZoomOutIcon className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2Icon className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="max-h-screen overflow-auto">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Loader2Icon className="h-8 w-8 animate-spin" />}
          >
            {/* Render the first 5 pages */}
            {Array.from({ length: Math.min(numPages || 0, 5) }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                rotate={rotation}
                className="my-4"
                loading={<Loader2Icon className="h-8 w-8 animate-spin" />}
              />
            ))}

            {/* Render the remaining pages only after the initial pages are loaded */}
            {initialPagesLoaded &&
              Array.from(
                { length: (numPages || 0) - 5 },
                (_, index) => index + 6
              ).map((pageNumber) => (
                <Page
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  className="my-4"
                  loading={<Loader2Icon className="h-8 w-8 animate-spin" />}
                />
              ))}
          </Document>
        </div>
      )}

      {numPages && (
        <p className="text-sm text-gray-500">
          Showing {Math.min(5, numPages)} of {numPages} pages
        </p>
      )}
    </div>
  );
}

export default PdfView;


// "use client"
// import React from 'react'
// import { useState, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
// import { Button } from './ui/button';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface PdfViewProps {
//   url?: string;
//   fileId?: string;
// }

// function PdfView({ url, fileId }: PdfViewProps) {
//   const [numPages, setNumPages] = useState<number>();
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [file, setFile] = useState<Blob | null>(null);
//   const [rotation, setRotation] = useState<number>(0);
//   const [scale, setScale] = useState<number>(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFile = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         let finalUrl = url;
//         if (fileId && !url) {
//           finalUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
//         }
//         console.log('finalUrl: ', finalUrl);
        
//         if (!finalUrl) {
//           throw new Error("No URL provided");
//         }

//         setPdfUrl(finalUrl);
//         const response = await fetch(finalUrl);
//         if (!response.ok) throw new Error('Failed to fetch PDF');
        
//         const blob = await response.blob();
//         setFile(blob);
//       } catch (err) {
//         console.error('Error fetching PDF:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load PDF');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFile();
//   }, [url, fileId]);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//     setNumPages(numPages);
//   }

//   const rotate = () => {
//     setRotation((prevRotation) => (prevRotation + 90) % 360);
//   };

//   const zoomIn = () => {
//     setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
//   };

//   const zoomOut = () => {
//     setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
//   };

//   if (error) {
//     return <div className="text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow">
//       <div className="flex space-x-2 mb-4">
//         <Button onClick={rotate} variant="outline" size="icon">
//           <RotateCw className="h-4 w-4" />
//         </Button>
//         <Button onClick={zoomIn} variant="outline" size="icon">
//           <ZoomInIcon className="h-4 w-4" />
//         </Button>
//         <Button onClick={zoomOut} variant="outline" size="icon">
//           <ZoomOutIcon className="h-4 w-4" />
//         </Button>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center h-96">
//           <Loader2Icon className="h-8 w-8 animate-spin" />
//         </div>
//       ) : (
//         <div className="max-h-screen overflow-auto">
//           <Document
//             file={file}
//             onLoadSuccess={onDocumentLoadSuccess}
//             loading={<Loader2Icon className="h-8 w-8 animate-spin" />}
//           >
//             <Page
//               pageNumber={pageNumber}
//               scale={scale}
//               rotate={rotation}
//               loading={<Loader2Icon className="h-8 w-8 animate-spin" />}
//             />
//           </Document>
//         </div>
//       )}

//       {numPages && (
//         <p className="text-sm text-gray-500">
//           Page {pageNumber} of {numPages}
//         </p>
//       )}
//     </div>
//   );
// }

// export default PdfView;