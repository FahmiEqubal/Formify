import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Typography, TextField, Card, CardContent } from "@material-ui/core";
import "../css/user_form.css";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer/useReducer";
import axios from "axios";

function User_form() {
  const navigate = useNavigate();
  const location = useLocation();
  const [{ questions = [], doc_name, doc_desc }, dispatch] = useStateValue();
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.formData) {
      const { formData } = location.state;
      dispatch({
        type: actionTypes.SET_QUESTIONS,
        questions: formData.questions,
      });
      setAnswers(formData.questions.map((question) => ({
        question: question.questionText,
        answer: "",
        isCorrect: false
      })));
      setQuestionsLoading(false);
      dispatch({
        type: actionTypes.SET_DOC_NAME,
        doc_name: formData.document_name || "",
      });
      dispatch({
        type: actionTypes.SET_DOC_DESC,
        doc_desc: formData.doc_desc || "",
      });
    } else {
      async function fetchQuestions() {
        try {
          const response = await axios.get("http://localhost:5000/questions/latest");
          const { data } = response;
          console.log("Fetched data:", data); // Log fetched data for debugging
          dispatch({
            type: actionTypes.SET_QUESTIONS,
            questions: data.questions,
          });
          setAnswers(data.questions.map((question) => ({
            question: question.questionText,
            answer: "",
            isCorrect: false
          })));
          setQuestionsLoading(false);
          dispatch({
            type: actionTypes.SET_DOC_NAME,
            doc_name: data.document_name || "",
          });
          dispatch({
            type: actionTypes.SET_DOC_DESC,
            doc_desc: data.doc_desc || "",
          });
        } catch (error) {
          console.error("Error fetching questions:", error);
          setQuestionsLoading(false);
          setError("Failed to load questions. Please try again later.");
        }
      }

      fetchQuestions();
    }
  }, [dispatch, location.state]);

  function selectAnswer(questionText, answer) {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((ans) =>
        ans.question === questionText ? { ...ans, answer: answer } : ans
      );
      return updatedAnswers;
    });
  }

  function handleInputChange(questionText, userAnswer) {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((ans) =>
        ans.question === questionText ? { ...ans, answer: userAnswer } : ans
      );
      return updatedAnswers;
    });
  }

  async function handleSubmit() {
    let score = 0;
    const totalQuestions = questions.length;

    const updatedAnswers = answers.map((ans) => {
      const question = questions.find((q) => q.questionText === ans.question);
      if (question && ans.answer === question.answer) {
        score++;
        return { ...ans, isCorrect: true };
      } else {
        return { ...ans, isCorrect: false };
      }
    });

    setAnswers(updatedAnswers);

    const result = `You scored ${score} out of ${totalQuestions}\n\n`;
    let resultDisplay = "";

    updatedAnswers.forEach((ans) => {
      const question = questions.find((q) => q.questionText === ans.question);
      if (ans.isCorrect) {
        resultDisplay += `${ans.question}: ${ans.answer} (Correct)\n`;
      } else {
        resultDisplay += `${ans.question}: ${ans.answer} (Wrong)\n`;
      }
    });

    try {
      await axios.post("http://localhost:5000/submit_responses", {
        userName,
        answers: updatedAnswers,
        documentId: questions[0]._id
      });

      navigate(`/submitted`, { state: { result, resultDisplay } });
    } catch (error) {
      console.error("Error submitting responses:", error);
      setError("Failed to submit responses. Please try again later.");
    }
  }

  return (
    <div className="submit">
      <div className="user_form">
        {questionsLoading ? (
          <Typography>Loading questions...</Typography>
        ) : (
          <div className="user_form_section">
            <Card className="user_form_card">
              <CardContent>
                <Typography variant="h5">{doc_name}</Typography>
                <Typography variant="subtitle1">{doc_desc}</Typography>
              </CardContent>
            </Card>
            <Card className="user_form_card">
              <CardContent>
                <TextField
                  label="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </CardContent>
            </Card>
            {questions.map((question) => (
              <Card className="user_form_card" key={question._id}>
                <CardContent>
                  <Typography variant="h6">{question.questionText}</Typography>
                  {question.questionType === "multiple_choice" ? (
                    question.options.map((option, index) => (
                      <div key={index} style={{ marginBottom: "5px" }}>
                        <label>
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            className="form-check-input"
                            onChange={() => selectAnswer(question.questionText, option)}
                          />
                          {option}
                        </label>
                      </div>
                    ))
                  ) : (
                    <TextField
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(question.questionText, e.target.value)}
                      placeholder="Write your answer"
                      value={answers.find(ans => ans.question === question.questionText)?.answer || ""}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
            <div className="user_form_submit">
              <Button variant="contained" color="primary" onClick={handleSubmit} style={{ fontSize: "14px" }}>
                Submit
              </Button>
            </div>
            {error && (
              <Typography color="error" variant="body1">{error}</Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default User_form;
