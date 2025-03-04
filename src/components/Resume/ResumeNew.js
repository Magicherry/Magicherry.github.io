import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../MainFrame/Particle";
import pdf from "../../Assets/cv/CV-Yuting Zhou.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew(iterable) {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
      <div>
        <Container fluid className="resume-section">
          <Particle />
          <Row style={{ justifyContent: "center", position: "relative" }}>
            <Button
                style={{ borderRadius: "20px", maxWidth: "250px" }}
                variant="primary"
                href={pdf}
                target="_blank"
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </Button>
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
                          style={{
                            marginBottom: "20px",
                            borderRadius: "5px",
                            overflow: "hidden"
                          }}
                      >
                        <Page
                            pageNumber={index + 1}
                            scale={width > 786 ? 1.5 : 0.8}
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
