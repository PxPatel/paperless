import React from 'react';
import PDFViewer from '@/components/PDFViewer';

const App: React.FC = () => {
    return (
        <div >
            <h1>React PDF Viewer</h1>
            {/* Ensure your example.pdf file is placed inside the public/ directory */}
            <PDFViewer fileUrl="/example.pdf" />
        </div>
    );
};

export default App;
