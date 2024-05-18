import React, { useState, useEffect } from "react";
import "../css/Templates.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { v4 as uuid } from "uuid";
import { useStateValue } from "../StateProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CodeIcon from "@mui/icons-material/Code";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

function Templates() {
  const navigate = useNavigate();
  const [{ doc_name }, dispatch] = useStateValue();
  const [recentForms, setRecentForms] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [formData, setFormData] = useState(null); // New state to store form data

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/get_all_filenames"
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching filenames:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchRecentForms() {
      try {
        const response = await axios.get(
          "http://localhost:5000/get_recent_forms"
        );
        setRecentForms(response.data.recentForms); 
      } catch (error) {
        console.error("Error fetching recent forms:", error);
      }
    }

    fetchRecentForms();
  }, []);

  useEffect(() => {
    async function fetchForm(formId) {
      try {
        const response = await axios.get(`http://localhost:5000/get_form/${formId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    }

    if (selectedFormId) {
      fetchForm(selectedFormId);
    }
  }, [selectedFormId]);

  function createform() {
    var create_form_id = uuid();
    navigate("/form/" + create_form_id);
  }

  function navigateToQuiz() {
    navigate("/quiz");
  }

  function navigateToQuizAI() {
    navigate("/quizai");
  }

  function navigateToForm(form) {
    navigate("/user_form", { state: { formData: form } });
  }

  return (
    <div className="template_section">
      <div className="template_top">
        <div className="template_left">
          <p>Formify Services</p>
        </div>
      </div>

      <div className="template_body">
        <div className="create-card" onClick={createform}>
          <AddCircleOutlineIcon style={{ color: "#6186FF", fontSize: "48px" }} />
          <p className="title">Start Manual Form</p>
        </div>

        <div className="create-card" onClick={() => navigate("/user_form")}>
          <VisibilityOutlinedIcon style={{ color: "#FFFCF0", fontSize: "48px" }} />
          <p className="title">User Form</p>
        </div>

        <div className="create-card" onClick={navigateToQuiz}>
          <CodeIcon style={{ color: "#FF1C1C", fontSize: "48px" }} />
          <p className="title">Scrap MCQ</p>
        </div>

        <div className="create-card" onClick={navigateToQuizAI}>
          <ChatOutlinedIcon style={{ color: "#026B00", fontSize: "48px" }} />
          <p className="title">ChatGpt MCQ</p>
        </div>
      </div>

      <div className="template_top">
        <div className="template_left">
          <p>Recent Form</p>
        </div>
      </div>
      <div className="template_body">
        {recentForms.length > 0 ? (
          recentForms.map((form, index) => (
            <div
              className="create-card"
              key={index}
              onClick={() => navigateToForm(form)}
            >
              <HistoryOutlinedIcon
                style={{ color: "#FCFCD4", fontSize: "48px" }}
              />
              <div className="doc_card_content">
                <h6 style={{ overflow: "ellipsis", color: "white" }}>
                  {form.document_name ? form.document_name : "Untitled Doc"}
                </h6>
                <p style={{ color: "gray", fontSize: "12px" }}>
                  {form.doc_desc ? form.doc_desc : "No description"}
                </p>
                <p style={{ color: "gray", fontSize: "12px" }}>
                  Created at: {new Date(form.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recent forms found.</p>
        )}
      </div>
    </div>
  );
}

export default Templates;
