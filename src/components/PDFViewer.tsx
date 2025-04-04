"use client"
import React, { useState, useRef, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFDocument, rgb } from 'pdf-lib';  // Import pdf-lib
import { Canvg } from 'canvg';  // Import canvg

interface PDFViewerProps {
  fileUrl: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface Annotation {
  x: number;
  y: number;
  text: string;
  id: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnnotationText, setNewAnnotationText] = useState<string>("");
  const [isAddingAnnotation, setIsAddingAnnotation] = useState<boolean>(false);
  const [annotationPosition, setAnnotationPosition] = useState<{ x: number; y: number } | null>(null);

  const annotationContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 800;
      ctxRef.current = canvas.getContext("2d");
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleThumbnailClick = (pageNum: number) => {
    setSelectedPage(pageNum);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAnnotationText(event.target.value);
  };

  const addAnnotation = () => {
    if (newAnnotationText.trim() === "" || !annotationPosition) return;

    const newAnnotation: Annotation = {
      x: annotationPosition.x,
      y: annotationPosition.y,
      text: newAnnotationText,
      id: Date.now(),
    };

    setAnnotations([...annotations, newAnnotation]);
    setNewAnnotationText("");
    setIsAddingAnnotation(false);
    setAnnotationPosition(null);
  };

  const handleAddAnnotationClick = (e: React.MouseEvent) => {
    if (!isAddingAnnotation) return;

    const rect = annotationContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setAnnotationPosition({ x, y });
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!ctxRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!ctxRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (ctxRef.current) {
      ctxRef.current.closePath();
    }
  };

  const convertCanvasToSVG = async () => {
    if (!canvasRef.current) return "";
  
    // Get the CanvasRenderingContext2D context
    const context = canvasRef.current.getContext('2d');
    if (!context) return "";
  
    // Use Canvg to render the canvas as SVG (async)
    const canvgInstance = await Canvg.from(context, canvasRef.current.toDataURL());
    
    // Start rendering
    await canvgInstance.start();
    
    // Get the SVG string using the toSvg() method
    const svgString = canvgInstance.toSvg();
    
    return svgString;
  };
  
  const handleSubmit = async () => {
    // Load the original PDF
    const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPages()[selectedPage - 1]; // Get the selected page

    // Add annotations as text
    annotations.forEach((annotation) => {
      page.drawText(annotation.text, {
        x: annotation.x,
        y: annotation.y,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    // Convert the canvas drawing into SVG
    const svgString = convertCanvasToSVG();

    // Embed SVG into the PDF
    if (svgString) {
      const svgImage = await pdfDoc.embedSvg(svgString);
      const { width, height } = page.getSize();
      
      page.drawImage(svgImage, {
        x: 100, // Adjust position as needed
        y: height - 200, // Adjust position as needed
        width: 400, // Adjust size as needed
        height: 400, // Adjust size as needed
      });
    }

    // Save the updated PDF
    const pdfBytes = await pdfDoc.save();

    // Trigger download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modified.pdf';
    link.click();
  };

  return (
    <div style={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px", background: "#f8f8f8", textAlign: "center", borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => {
            setIsAddingAnnotation(!isAddingAnnotation);
          }}
          style={{
            padding: "8px 15px",
            background: isAddingAnnotation ? "gray" : "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          {isAddingAnnotation ? "Cancel" : "Add Text"}
        </button>

        <button
          onClick={handleSubmit}
          style={{
            padding: "8px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginLeft: "10px",
          }}
        >
          Submit and Download PDF
        </button>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "20%", padding: "10px", overflowY: "auto", borderRight: "4px solid #ddd" }}>
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {[...Array(numPages)].map((_, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  border: selectedPage === index + 1 ? "3px solid blue" : "none",
                }}
                onClick={() => handleThumbnailClick(index + 1)}
              >
                <Page pageNumber={index + 1} width={100} />
                <p>{index + 1}</p>
              </div>
            ))}
          </Document>
        </div>

        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            border: "2px solid",
          }}
          ref={annotationContainerRef}
        >
          <div style={{ position: "relative" }}>
            <Document file={fileUrl}>
              <Page pageNumber={selectedPage} width={600} />
            </Document>

            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: 3,
                pointerEvents: "auto",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />

            {/* Render Text Annotations */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                style={{
                  position: "absolute",
                  left: annotation.x,
                  top: annotation.y,
                  background: "yellow",
                  padding: "5px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {annotation.text}
              </div>
            ))}

            {/* Input Field for New Text Annotation */}
            {isAddingAnnotation && annotationPosition && (
              <div style={{ position: "absolute", left: annotationPosition.x, top: annotationPosition.y, background: "yellow", padding: "5px", borderRadius: "5px" }}>
                <input type="text" value={newAnnotationText} onChange={handleInputChange} placeholder="Enter annotation text..." />
                <button onClick={addAnnotation}>Save</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;