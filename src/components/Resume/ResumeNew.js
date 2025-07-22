import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../MainFrame/Particle";
import pdf from "../../Assets/cv/CV-Yuting Zhou.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
      <div>
        <Container fluid className="resume-section">
          <Particle />
          <Row className="resume__row">
            <div className="d-flex justify-content-center">
              <Button
                  className="resume__download-button"
                  variant="primary"
                  href={pdf}
                  target="_blank"
              >
                <AiOutlineDownload />
                &nbsp;Download CV
              </Button>
            </div>
          </Row>

          <Row className="resume d-flex flex-column align-items-center">
            <Document
                file={pdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="d-flex justify-content-center flex-column align-items-center"
            >
              {numPages &&
                  Array.from({ length: numPages }, (_, index) => (
                      <div
                          key={index + 1}
                          className="resume__page-container"
                      >
                        <Page
                            pageNumber={index + 1}
                            width={width > 786 ? 900 : width - 50}
                        />
                      </div>
                  ))}
            </Document>
          </Row>
        </Container>
      </div>
  );
}

export default ResumeNew;
