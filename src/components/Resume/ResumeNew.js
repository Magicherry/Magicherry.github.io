import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "../../Assets/cv/Yuting_Zhou_CV.pdf";
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

const LoadingSpinner = () => (
    <div className="resume-pdf-container">
        <Spinner animation="border" style={{ color: '#5fe1f8' }} />
    </div>
);

const DownloadButton = () => (
    <div className="d-flex justify-content-center">
        <Button className="download-cv-button" variant="primary" href={pdf} target="_blank">
            <AiOutlineDownload />
            &nbsp;Download CV
        </Button>
    </div>
);

function ResumeNew() {
    const [width, setWidth] = useState(1200);
    const [numPages, setNumPages] = useState(null);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const handleResize = useCallback(() => {
        setWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        const debouncedHandleResize = debounce(handleResize, 300); // 延迟300毫秒执行
        window.addEventListener('resize', debouncedHandleResize);
        handleResize(); // 初始加载时执行一次

        // 清理函数
        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, [handleResize]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div>
            <Container fluid className="resume-section">
                <Row className="resume__row animate-item delay-1">
                    <DownloadButton />
                </Row>

                <div className="resume-container animate-item delay-2">
                    <Document
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<LoadingSpinner />}
                        className="pdf-document"
                    >
                        {Array.from({ length: numPages || 0 }, (_, index) => (
                            <div key={`page_${index + 1}`} className="pdf-page-container">
                                <Page
                                    pageNumber={index + 1}
                                    width={Math.min(width * 0.9, 1050)}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={false}
                                />
                            </div>
                        ))}
                    </Document>
                </div>
                <Row className="resume__row bottom-download-row animate-item delay-1">
                    <DownloadButton />
                </Row>
            </Container>
        </div>
    );
}

export default ResumeNew;