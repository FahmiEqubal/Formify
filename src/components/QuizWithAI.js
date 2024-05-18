import React, { useState } from 'react';
import axios from 'axios';
import './QuizWithAI.css';

const QuizApp = () => {
  const [name, setName] = useState('');
  const [topicName, setTopicName] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    const chatGPTOptions = {
      method: 'POST',
      url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'aff28a004cmsh65396d95485da8ep1a804fjsn5421aac25ddc',
        'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
      },
      // 'X-RapidAPI-Key': '48b5f3c733msh2a41c2b2b530667p1d8c2fjsnbc27a07b20ce',
      data: {
        messages: [
          {
            role: 'user',
            content: `${name} wants to generate ${numQuestions} MCQ questions on the topic "${topicName}"`
          }
        ],
        system_prompt: '',
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false
      }
    };

    try {
      const response = await axios.request(chatGPTOptions);
      if (response.data.result) {
        const mcqQuestions = extractMCQQuestions(response.data.result);
        setQuestions(mcqQuestions);
        setResult(`${name}, please answer the following questions:`);
        setIsGenerating(false);
      } else {
        console.error('No MCQ questions in response:', response.data);
      }
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  const extractMCQQuestions = (response) => {
    if (!response) {
      console.error('Response is empty or undefined');
      return [];
    }
    const mcqQuestions = response.split('\n');
    return mcqQuestions.map((question) => {
      const [questionText, ...options] = question.split('\n');
      return {
        questionText: questionText.trim(),
        options: options.map((option) => option.trim()),
        answer: '', // Add a property to store the correct answer
      };
    });
  };

  const handleAnswerChange = (index, value) => {
    setSelectedAnswers({ ...selectedAnswers, [index]: value });
  };

  const handleSubmitAnswers = () => {
    setIsSubmitting(true);
    let score = 0;
    const correctAnswers = questions.map((question) => question.answer);

    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === correctAnswers[i]) {
        score++;
      }
    }

    setResult(`${name}, your score is ${score} out of ${numQuestions}`);
    setIsSubmitting(false);
  };

  return (
    <div className="quiz-container">
      <h1>ChatGpt MCQ </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Name:
        </label>
          <input type="text" className="url-input" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>
          Topic Name:
        </label>
          <input type="text" className="url-input" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
        <br />
        <label>
          Number of Questions:
        </label>
          <input type="number" className="url-input" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} />
        <br />
        <button className="fetch-button" type="submit" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {questions.length > 0 && (
        <div className="questions-container">
          {questions.map((question, index) => (
            <div key={index} className="question">
              <p>{question.questionText}</p>
              <ul className="options-list">
                {question.options.map((option, i) => (
                  <li key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={i}
                        checked={selectedAnswers[index] === i}
                        onChange={() => handleAnswerChange(index, i)}
                        disabled={isSubmitting}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button className="submit-button" onClick={handleSubmitAnswers} disabled={isSubmitting}>
            Submit Answers
          </button>
        </div>
      )}

      {result && <h3 className="result">{result}</h3>}
    </div>
  );
};

export default QuizApp;
