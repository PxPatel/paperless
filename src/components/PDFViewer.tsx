"use client" 
import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; 
import { pdfjs } from 'react-pdf';

interface PDFViewerProps {
    fileUrl: string;
}


const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
    return (
        <div style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%', height: '100%' }}>
                {/* Ensures PDF rendering works properly without default layout */}
                <Worker workerUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={fileUrl} />
                </Worker>
            </div>
        </div>
    );
};

export default PDFViewer;
