import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";

// 建议将 Assets 文件夹移入 src 目录，并相应更新此路径
// 例如：import pdf from "../assets/cv/Yuting_Zhou_CV.pdf";
import pdf from "../../Assets/cv/Yuting_Zhou_CV.pdf";
import 'react-pdf/dist/Page/TextLayer.css';

// 确保 public 文件夹中有 pdf.worker.min.mjs 文件
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
        const debouncedHandleResize = debounce(handleResize, 300);
        window.addEventListener('resize', debouncedHandleResize);
        handleResize();

        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, [handleResize]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // 【新增】一个错误处理函数，用于捕获 react-pdf 的内部错误
    const onPdfError = (error) => {
        console.error("PDF加载错误 (PDF loading error):", error);
        // 你可以在这里设置一个状态，用于在页面上显示友好的错误提示
    };

    return (
        <div>
            <Container fluid className="resume-section">
                <Row className="resume__row animate-item delay-1">
                    <DownloadButton />
                </Row>

                <div className="resume-container animate-item delay-2">
                    <Document
                        // 【关键修改】将 file prop 从字符串改为对象，这是最核心的修复
                        file={{
                            url: pdf,
                        }}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // 【新增】添加错误回调 prop，用于调试
                        onLoadError={onPdfError}
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