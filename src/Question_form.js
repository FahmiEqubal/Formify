import React, { useState } from "react";
import "./QuestionForm.css"; // Import your CSS file for styling

function QuestionForm() {
  const [formHeading, setFormHeading] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answerInput, setAnswerInput] = useState(""); // State to store answer input
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); // State to store selected question index

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "multiple_choice",
        options: ["", "", "", ""],
        answer: null,
      },
    ]);
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionType = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleSaveAnswer = (index) => {
    setSelectedQuestionIndex(index); // Set the selected question index
    setAnswerInput(questions[index].answer || ""); // Initialize answer input with existing answer
  };

  const handleAnswerInputChange = (e) => {
    setAnswerInput(e.target.value);
  };

  const handleAnswerSave = () => {
    if (selectedQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[selectedQuestionIndex].answer = answerInput;
      setQuestions(updatedQuestions);
      setAnswerInput(""); // Clear answer input after saving
      setSelectedQuestionIndex(null); // Clear selected question index after saving
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://serverformify.onrender.com/add_questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_name: formHeading,
          doc_desc: formDescription,
          questions: questions.map(({ answer, ...rest }) => rest),
          answers: questions.map(({ answer }) => answer),
        }),
      });
      if (response.ok) {
        console.log("Questions submitted successfully");
        setQuestions([]); // Clear questions after submitting
      } else {
        console.error("Failed to submit questions");
      }
    } catch (err) {
      console.error("Error submitting questions:", err);
    }
  };

  return (
    <div className="question-form">
      <div className="form-inputs">
        <input
          type="text"
          className="form-input"
          placeholder="Heading"
          value={formHeading}
          onChange={(e) => setFormHeading(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Add Description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />
      </div>
      {questions.map((question, index) => (
        <div key={index} className="question-card">
          <input
            type="text"
            className="question-input"
            placeholder="Write Question"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(index, e)}
          />
          <select
            value={question.questionType}
            onChange={(e) => handleQuestionTypeChange(index, e)}
          >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="text">Text</option>
          </select>
          {question.questionType === "multiple_choice" && (
            <>
              {question.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  className="option-input"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e)}
                />
              ))}
            </>
          )}
          <button
            className="add-answer-button"
            onClick={() => handleSaveAnswer(index)}
          >
            Answer
          </button>
          {selectedQuestionIndex === index && (
            <div>
              <input
                type="text"
                className="answer-input"
                placeholder="Write Your Answer"
                value={answerInput}
                onChange={handleAnswerInputChange}
              />
              <button
                className="save-answer-button"
                onClick={handleAnswerSave}
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))}
      <button className="add-question-button" onClick={handleAddQuestion}>
        Add Question
      </button>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default QuestionForm;
