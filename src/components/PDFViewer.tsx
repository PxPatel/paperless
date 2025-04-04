"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Download,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Type,
} from "lucide-react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface PDFViewerProps {
  fileUrl: string;
}

interface TextBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isEditing: boolean;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [isTextBoxMode, setIsTextBoxMode] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  // Text box states
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [isCreatingTextBox, setIsCreatingTextBox] = useState<boolean>(false);
  const [textBoxStart, setTextBoxStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeTextBoxId, setActiveTextBoxId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {}
  );
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Initialize canvas when the component mounts or when the page changes
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;
      }
    }

    // Reset text boxes when changing pages
    setTextBoxes([]);
    setIsCreatingTextBox(false);
    setTextBoxStart(null);
    setActiveTextBoxId(null);
  }, [selectedPage, canvasSize]);

  // Focus on text area when a text box becomes active
  useEffect(() => {
    if (activeTextBoxId && textAreaRefs.current[activeTextBoxId]) {
      textAreaRefs.current[activeTextBoxId]?.focus();
    }
  }, [activeTextBoxId]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  // Update canvas size when the PDF page renders
  const onPageRenderSuccess = (page: any) => {
    if (pdfContainerRef.current && canvasRef.current) {
      const { width, height } = pdfContainerRef.current.getBoundingClientRect();
      setCanvasSize({
        width: width,
        height: height,
      });

      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear the canvas when changing pages
      if (ctxRef.current) {
        ctxRef.current.clearRect(0, 0, width, height);
      }
    }
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent) => {
    if (!isDrawingMode || !ctxRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingMode || !isDrawing || !ctxRef.current || !canvasRef.current)
      return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingMode || !ctxRef.current) return;

    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  // Text box functions
  const handlePdfClick = (e: React.MouseEvent) => {
    if (!isTextBoxMode || !pdfContainerRef.current) return;

    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isCreatingTextBox) {
      // First click - start creating a text box
      setTextBoxStart({ x, y });
      setIsCreatingTextBox(true);
    } else {
      // Second click - finish creating the text box
      if (textBoxStart) {
        // Calculate dimensions
        const width = Math.abs(x - textBoxStart.x);
        const height = Math.abs(y - textBoxStart.y);

        // Calculate top-left corner
        const topLeftX = Math.min(x, textBoxStart.x);
        const topLeftY = Math.min(y, textBoxStart.y);

        // Create a new text box if it has minimum dimensions
        if (width > 20 && height > 20) {
          const newTextBox: TextBox = {
            id: `textbox-${Date.now()}`,
            x: topLeftX,
            y: topLeftY,
            width,
            height,
            text: "",
            isEditing: true,
          };

          setTextBoxes([...textBoxes, newTextBox]);
          setActiveTextBoxId(newTextBox.id);
        }
      }

      // Reset text box creation state
      setIsCreatingTextBox(false);
      setTextBoxStart(null);
    }
  };

  const handleTextBoxClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    // Set all text boxes to not editing
    const updatedTextBoxes = textBoxes.map((box) => ({
      ...box,
      isEditing: box.id === id,
    }));

    setTextBoxes(updatedTextBoxes);
    setActiveTextBoxId(id);
  };

  const handleTextChange = (id: string, text: string) => {
    const updatedTextBoxes = textBoxes.map((box) =>
      box.id === id ? { ...box, text } : box
    );

    setTextBoxes(updatedTextBoxes);
  };

  // Clear the canvas
  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  // Clear all text boxes
  const clearTextBoxes = () => {
    setTextBoxes([]);
    setActiveTextBoxId(null);
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    if (isTextBoxMode) setIsTextBoxMode(false);
  };

  // Toggle text box mode
  const toggleTextBoxMode = () => {
    setIsTextBoxMode(!isTextBoxMode);
    if (isDrawingMode) setIsDrawingMode(false);

    // Reset text box creation state
    setIsCreatingTextBox(false);
    setTextBoxStart(null);
  };

  // Navigate to previous page
  const goToPreviousPage = () => {
    if (selectedPage > 1) {
      setSelectedPage(selectedPage - 1);
    }
  };

  // Navigate to next page
  const goToNextPage = () => {
    if (selectedPage < numPages) {
      setSelectedPage(selectedPage + 1);
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (pageNum: number) => {
    setSelectedPage(pageNum);
  };

  // Check if canvas is blank
  const isCanvasBlank = (canvas: HTMLCanvasElement): boolean => {
    const context = canvas.getContext("2d");
    if (!context) return true;

    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some((color) => color !== 0);
  };

  // Download the modified PDF
  const downloadPDF = async () => {
    try {
      // Show loading state
      setLoading(true);

      // Load the original PDF
      const existingPdfBytes = await fetch(fileUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the current page
      const page = pdfDoc.getPages()[selectedPage - 1];
      const { width: pageWidth, height: pageHeight } = page.getSize();

      // Add text boxes to the PDF
      if (textBoxes.length > 0) {
        // Embed a standard font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add each text box
        textBoxes.forEach((textBox) => {
          if (textBox.text.trim()) {
            // Calculate position (convert from viewer coordinates to PDF coordinates)
            const scaleFactorX = pageWidth / canvasSize.width;
            const scaleFactorY = pageHeight / canvasSize.height;

            const x = textBox.x * scaleFactorX;
            // PDF coordinates start from bottom, so we need to invert the y-coordinate
            const y = pageHeight - (textBox.y + textBox.height) * scaleFactorY;

            // Add text to the PDF
            page.drawText(textBox.text, {
              x,
              y,
              size: 12,
              font,
              color: rgb(0, 0, 0),
              lineHeight: 14,
            });
          }
        });
      }

      // Only add drawing if canvas has content
      if (canvasRef.current) {
        const canvasImage = canvasRef.current.toDataURL("image/png");

        // Check if canvas has drawings (not just a blank canvas)
        const hasDrawings = !isCanvasBlank(canvasRef.current);

        if (hasDrawings) {
          // Convert canvas to image and embed it
          const canvasImageBytes = await fetch(canvasImage).then((res) =>
            res.arrayBuffer()
          );
          const image = await pdfDoc.embedPng(canvasImageBytes);

          // Draw the image on the page
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: pageWidth,
            height: pageHeight,
            opacity: 0.9,
          });
        }
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Create a download link
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `annotated-document-page-${selectedPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hide loading state
      setLoading(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setLoading(false);
      alert("There was an error downloading the PDF. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with controls */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDrawingMode}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              isDrawingMode
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isDrawingMode ? (
              <>
                <X size={18} />
                <span>Exit Drawing Mode</span>
              </>
            ) : (
              <>
                <Pencil size={18} />
                <span>Draw on PDF</span>
              </>
            )}
          </button>

          <button
            onClick={toggleTextBoxMode}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              isTextBoxMode
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isTextBoxMode ? (
              <>
                <X size={18} />
                <span>Exit Text Box Mode</span>
              </>
            ) : (
              <>
                <Type size={18} />
                <span>Add Text Box</span>
              </>
            )}
          </button>

          {isDrawingMode && (
            <button
              onClick={clearCanvas}
              className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} />
              <span>Clear Drawing</span>
            </button>
          )}

          {textBoxes.length > 0 && (
            <button
              onClick={clearTextBoxes}
              className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} />
              <span>Clear Text Boxes</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            <Download size={18} />
            <span>{loading ? "Processing..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with thumbnails */}
        <div className="w-64 bg-white shadow-md overflow-y-auto border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">Pages</h2>
          </div>

          <div className="p-2">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="p-4 text-center text-gray-500">
                  Loading document...
                </div>
              }
              error={
                <div className="p-4 text-center text-red-500">
                  Failed to load PDF document
                </div>
              }
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`thumbnail-${index + 1}`}
                  className={`mb-3 p-2 cursor-pointer rounded-md transition-colors ${
                    selectedPage === index + 1
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleThumbnailClick(index + 1)}
                >
                  <div className="relative">
                    <Page
                      pageNumber={index + 1}
                      width={150}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                    <div className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-tl-md">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </Document>
          </div>
        </div>

        {/* Main PDF viewer */}
        <div className="flex-1 overflow-auto relative">
          <div className="flex justify-center p-4 bg-gray-800">
            {/* Page navigation */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-2">
              <button
                onClick={goToPreviousPage}
                disabled={selectedPage <= 1}
                className={`p-2 rounded-full bg-white shadow-md ${
                  selectedPage <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex flex-col space-y-2">
              <button
                onClick={goToNextPage}
                disabled={selectedPage >= numPages}
                className={`p-2 rounded-full bg-white shadow-md ${
                  selectedPage >= numPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* PDF document */}
            <div
              ref={pdfContainerRef}
              className="relative bg-white shadow-lg"
              style={{
                cursor: isDrawingMode
                  ? "crosshair"
                  : isTextBoxMode
                    ? isCreatingTextBox
                      ? "crosshair"
                      : "cell"
                    : "default",
              }}
              onClick={handlePdfClick}
            >
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-[800px] w-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                <Page
                  pageNumber={selectedPage}
                  width={600}
                  scale={scale}
                  onRenderSuccess={onPageRenderSuccess}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>

              {/* Drawing canvas overlay */}
              <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full ${isDrawingMode ? "z-10" : "pointer-events-none"}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />

              {/* Text box creation preview */}
              {isTextBoxMode && isCreatingTextBox && textBoxStart && (
                <div
                  className="absolute border-2 border-dashed border-purple-500 bg-purple-100 bg-opacity-30 z-20 pointer-events-none"
                  style={{
                    left: `${textBoxStart.x}px`,
                    top: `${textBoxStart.y}px`,
                    width: "100px",
                    height: "100px",
                  }}
                />
              )}

              {/* Text boxes */}
              {textBoxes.map((textBox) => (
                <div
                  key={textBox.id}
                  className={`absolute border-2 ${
                    textBox.isEditing
                      ? "border-purple-500"
                      : "border-purple-300"
                  } rounded z-20`}
                  style={{
                    left: `${textBox.x}px`,
                    top: `${textBox.y}px`,
                    width: `${textBox.width}px`,
                    height: `${textBox.height}px`,
                  }}
                  onClick={(e) => handleTextBoxClick(e, textBox.id)}
                >
                  <textarea
                    ref={(el) => {
                      textAreaRefs.current[textBox.id] = el;
                    }}
                    className="w-full h-full p-2 bg-transparent resize-none focus:outline-none"
                    value={textBox.text}
                    onChange={(e) =>
                      handleTextChange(textBox.id, e.target.value)
                    }
                    placeholder="Enter text here..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <div>
          Page {selectedPage} of {numPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Zoom out"
          >
            -
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(2.0, prev + 0.1))}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">Processing your document...</p>
          </div>    
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
