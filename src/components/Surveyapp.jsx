import React, { useState, useEffect } from 'react';

const questions = [
  {
    id: 1,
    text: 'How satisfied are you with our products?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 2,
    text: 'How fair are the prices compared to similar retailers?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 3,
    text: 'How satisfied are you with the value for money of your purchase?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 4,
    text: 'On a scale of 1-10, how likely are you to recommend us to your friends and family?',
    type: 'rating',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  },
  {
    id: 5,
    text: 'What could we do to improve our service?',
    type: 'text',
    options: [],
  },
  {
    id:6,
    text:'rate us on playstore or appstore',
    type:'text',
    options:['1','2','3','4','5'],
  },
  {
    id: 7,
    text: 'How easy is it to use our product?',
    type: 'text',
    options: [],
  },
];

const SurveyApp = () => {
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [sessionID, setSessionID] = useState('');
    const [completed, setCompleted] = useState(false);
    const [showResponse, setShowResponse] = useState(false);

    const handleViewResponse = () => {
      setShowResponse(true);
    };

  useEffect(() => {
    // Generate a session ID if not already present in local storage
    let sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      sessionID = generateSessionID();
      localStorage.setItem('sessionID', sessionID);
    }
    setSessionID(sessionID);
  }, []);

  const generateSessionID = () => {
    // Generate a unique session ID using timestamp and random number
    const timestamp = Date.now().toString(36);
    const randomNum = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomNum}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));

    // Save the answers in local storage
    localStorage.setItem(sessionID, JSON.stringify(answers));

    // Move to the next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      // Survey completed, display thank you message or redirect to another page
      // You can handle this based on your requirements
      console.log('Survey completed!');
    }
  };

 
 
 
  const handleStart = () => {
    setCurrentQuestion(0);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prevQuestion) => prevQuestion - 1);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const questionId = question.id;
    const answer = answers[questionId];
  
    switch (question.type) {
      case 'rating':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <div className="rating-box">
              {[1, 2, 3, 4, 5].map((rating) => (
                <React.Fragment key={rating}>
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name={`rating-${questionId}`}
                    value={rating}
                    checked={answer === rating}
                    onChange={(e) => handleAnswer(questionId, parseInt(e.target.value))}
                  />
                  <label htmlFor={`rating-${rating}`}>{rating}</label>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div>
            <p className="question-text">{question.text}</p>
            <textarea
              className="text-input"
              value={answer || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  

  const renderStartPage = () => {
    return (
        <div className="start-page">
        <h2>Welcome to the Survey</h2>
        <p>Click the button below to start the survey.</p>
        <button className="start-button" onClick={handleStart}>
          Start
        </button>
      </div>
    );
  };




  
  const ResponsePage = ({ questions, answers }) => {
    return (
      <div className="response-page">
        <h2>Survey Response</h2>
        <ul className="response-list">
          {questions.map((question) => (
            <li key={question.id}>
              <p className="question">{question.text}</p>
              <p className="answer">{answers[question.id]}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  
  if (showResponse) {
    return <ResponsePage questions={questions} answers={answers} />;
  }
  
  const ThankYouPage = ({ handleViewResponse }) => {
    return (
      <div className="thank-you-page">
        <h2>Thank You for Your Response!</h2>
        <button onClick={handleViewResponse}>View Your Response</button>
      </div>
    );
  };

  
  if (currentQuestion === -1) {
    return renderStartPage();
  }
  return (
    <div className="survey-container">
        {completed ? (
        <ThankYouPage handleViewResponse={handleViewResponse} />
      ) : (
        <div> 
            {currentQuestion > 0 && (
            <button className="previous-button" onClick={handlePrevious}>
              Previous
            </button>
          )}
          <button className="next-button" onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
          <p className="question-count">
            Question {currentQuestion + 1} / {questions.length}
          </p>
          {renderQuestion()}
        </div>
      )}
     
    </div>
  );
};

export default SurveyApp;
