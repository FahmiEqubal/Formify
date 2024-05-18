import React, { useRef } from "react";
import { Button, Typography } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { saveAs } from "file-saver";
import { Workbook } from "exceljs";
import { Document, Packer, Paragraph, TextRun } from "docx";

import "../css/user_form.css";

function SubmitForm() {
  const location = useLocation();
  const { result, resultDisplay } = location.state || {};

  const resultRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => resultRef.current,
    documentTitle: "User Form Result"
  });

  const handleExportExcel = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Results");
    const rows = resultDisplay.split("\n").map((line) => [line]);

    worksheet.addRows(rows);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "results.xlsx");
    });
  };

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: resultDisplay.split("\n").map((line) => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  color: line.includes("(Correct)") ? "008000" : "FF0000"
                })
              ]
            })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "results.docx");
    });
  };

  return (
    <div className="submit">
      <div className="user_form" ref={resultRef}>
        <div className="user_form_section">
          <div className="user_title_section">
            <Typography
              style={{
                fontSize: "26px",
                fontFamily: "'Google Sans','Roboto','Arial','sans-serif'",
              }}
            >
              Untitled Form
            </Typography>
            <br />
            <Typography style={{ fontSize: "13px", fontWeight: "400" }}>
              Your response has been recorded.
            </Typography>
            <br />
            <div className="result-container">
              <Typography style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
                {result}
              </Typography>
              <Typography style={{ fontSize: "14px" }}>
                {resultDisplay.split("\n").map((line, index) => (
                  <p
                    key={index}
                    style={{
                      color: line.includes("(Correct)") ? "green" : "red"
                    }}
                  >
                    {line}
                  </p>
                ))}
              </Typography>
            </div>
            <br />
            <a href="#" style={{ fontSize: "13px" }}>
              Submit another response
            </a>
            <div style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                style={{ marginRight: "10px" }}
              >
                Export as PDF
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportExcel}
                style={{ marginRight: "10px" }}
              >
                Export as Excel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportWord}
              >
                Export as Word
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitForm;
