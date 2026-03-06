import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Container, Row, Button, Spinner, ProgressBar } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "../../Assets/cv/Yuting_Zhou_CV.pdf";
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const LoadingSpinner = ({ progress }) => (
    <div className="resume-pdf-container">
        <div className="d-flex flex-column align-items-center gap-3">
            <Spinner animation="border" style={{ color: '#5fe1f8' }} />
            <div className="text-light small">Loading resume…</div>
            {Number.isFinite(progress) && progress > 0 ? (
                <div className="w-100" style={{ maxWidth: "280px" }}>
                    <ProgressBar
                        now={progress}
                        animated
                        striped
                        variant="info"
                        style={{ height: "6px" }}
                        aria-label="Resume loading progress"
                    />
                </div>
            ) : null}
        </div>
    </div>
);

const LoadingError = ({ message }) => (
    <div className="resume-pdf-container">
        <div className="text-center text-light">
            <div className="mb-2">Unable to load the PDF.</div>
            <div className="small text-muted">{message}</div>
        </div>
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
    const [loadError, setLoadError] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const containerRef = useRef(null);

    const handleResize = useCallback((nextWidth) => {
        if (!nextWidth || Number.isNaN(nextWidth)) return;
        setWidth(nextWidth);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return undefined;
        const element = containerRef.current;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            handleResize(entry.contentRect.width);
        });
        observer.observe(element);
        handleResize(element.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, [handleResize]);

    const onDocumentLoadSuccess = useCallback(({ numPages: loadedPages }) => {
        setNumPages(loadedPages);
        setLoadError(null);
        setLoadProgress(100);
    }, []);

    const onDocumentLoadError = useCallback((error) => {
        setLoadError(error?.message || "Unknown error");
    }, []);

    const onDocumentLoadProgress = useCallback((progress) => {
        const total = progress?.total || 0;
        const loaded = progress?.loaded || 0;
        if (!total) return;
        const percent = Math.min(100, Math.round((loaded / total) * 100));
        setLoadProgress(percent);
    }, []);

    const pageWidth = useMemo(() => Math.min(width * 0.9, 1050), [width]);

    return (
        <div>
            <Container fluid className="resume-section">
                <Row className="resume__row animate-item delay-1">
                    <DownloadButton />
                </Row>

                <div className="resume-container animate-item delay-2" ref={containerRef}>
                    <Document
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        onLoadProgress={onDocumentLoadProgress}
                        loading={<LoadingSpinner progress={loadProgress} />}
                        error={<LoadingError message={loadError || "Please try again later."} />}
                        className="pdf-document"
                    >
                        {Array.from({ length: numPages || 0 }, (_, index) => (
                            <div key={`page_${index + 1}`} className="pdf-page-container">
                                <Page
                                    pageNumber={index + 1}
                                    width={pageWidth}
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