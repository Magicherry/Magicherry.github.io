import React, { useState, useEffect } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import Particle from "../MainFrame/Particle";
import pdf from "../../Assets/cv/CV-Yuting Zhou.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./ResumeNew.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
                <Particle />

                <Row className="resume__row animate-item delay-1">
                    <div className="d-flex justify-content-center">
                        <Button className="resume__download-button" variant="primary" href={pdf} target="_blank">
                            <AiOutlineDownload />
                            &nbsp;Download CV
                        </Button>
                    </div>
                </Row>

                <Row className="resume d-flex flex-column align-items-center animate-item delay-2">
                    <Document
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="d-flex justify-content-center flex-column align-items-center"
                        loading={<LoadingSpinner />}
                    >
                        {Array.from({ length: numPages || 0 }, (_, index) => (
                            <div key={index + 1} className="pdf-page-fade-in my-2">
                                <Page
                                    pageNumber={index + 1}
                                    width={width > 786 ? 900 : width - 50}
                                    loading=""
                                />
                            </div>
                        ))}
                    </Document>
                </Row>
                <Row className="resume__row animate-item delay-1">
                    <div className="d-flex justify-content-center">
                        <Button className="resume__download-button" variant="primary" href={pdf} target="_blank">
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