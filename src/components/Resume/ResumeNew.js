import React, { useState, useEffect } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";

import pdf from "../../Assets/cv/CV-Yuting Zhou.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const LoadingSpinner = () => (
    <div className="resume-pdf-container">
        <Spinner
            animation="border"
            style={{ color: '#5fe1f8' }}
        />
    </div>
);


function ResumeNew() {
    const [width, setWidth] = useState(1200);
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Container fluid className="resume-section">
                <Row className="resume__row animate-item delay-1">
                    <div className="d-flex justify-content-center">
                        <Button className="download-cv-button" variant="primary" href={pdf} target="_blank">
                            <AiOutlineDownload />
                            &nbsp;Download CV
                        </Button>
                    </div>
                </Row>

                <div className="resume-container animate-item delay-2">
                    <Document
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<LoadingSpinner />}
                        className="pdf-document"
                    >
                        {Array.from({ length: numPages || 0 }, (_, index) => (
                            <div key={index + 1} className="pdf-page-container">
                                <Page
                                    pageNumber={index + 1}
                                    width={Math.min(width * 0.9, 1050)}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </div>
                        ))}
                    </Document>
                </div>
                <Row className="resume__row bottom-download-row animate-item delay-1">
                    <div className="d-flex justify-content-center">
                        <Button className="download-cv-button" variant="primary" href={pdf} target="_blank">
                            <AiOutlineDownload />
                            &nbsp;Download CV
                        </Button>
                    </div>
                </Row>
            </Container>
        </div>
    );
}

export default ResumeNew;