import React, { useState } from 'react';
import axios from 'axios';
import './Quiz.css';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [urlInput, setUrlInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlInputChange = (e) => {
        setUrlInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/scrape?url=${encodeURIComponent(urlInput)}`);
            const questionsWithCorrectAnswer = response.data.map(question => {
                const correctAnswerIndex = question.options.indexOf(question.correctAnswer);
                return {
                    ...question,
                    correctAnswer: correctAnswerIndex,
                };
            });
            setQuestions(questionsWithCorrectAnswer);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: optionIndex,
        });
    };

    const handleQuizSubmit = () => {
        let correctCount = 0;
        questions.forEach((question, index) => {
            const selectedOptionIndex = answers[index];
            const correctOptionIndex = question.correctAnswer;
    
            if (selectedOptionIndex === correctOptionIndex) {
                correctCount++;
            }
        });
        setResult(`You answered ${correctCount} out of ${questions.length} questions correctly.`);
    };
    

    return (
        <div className="quiz-container">
            <h1>Scrap MCQ</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={urlInput}
                    onChange={handleUrlInputChange}
                    placeholder="Enter URL"
                    className="url-input"
                />
                <button type="submit" className="fetch-button">Fetch Questions</button>
            </form>
            {isLoading && <p>Loading...</p>}
            {questions.length > 0 && (
                <div className="questions-container">
                    {questions.map((question, index) => (
                        <div key={index} className="question">
                            <p>{question.questionText}</p>
                            <ul className="options-list">
                                {question.options.map((option, i) => (
                                    <li key={i} className="option">
                                        <label>
                                            <input
                                                type="radio"
                                                checked={answers[index] === i}
                                                onChange={() => handleAnswerChange(index, i)}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button onClick={handleQuizSubmit} className="submit-button">Submit</button>
                    {result && <p className="result">{result}</p>}
                </div>
            )}
        </div>
    );
}

export default Quiz;
