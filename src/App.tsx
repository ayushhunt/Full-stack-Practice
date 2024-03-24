import React, { useState } from 'react';

import QuestionCard from './comp/QuestionCard';
import { fetchQuizQuestions } from './API';
//types
import { Difficulty,QuestionState } from './API';

import { GlobalStyle } from './App.styles';

export type AnswerObject = {
  question:string;
  answer:string;
  correct:boolean;
  correctAnswer:string;
}


const TOTAL = 10;

function App() {

  const [loading,setLoading] = useState(false);
  const [questions,setQuestions] = useState<QuestionState[]>([]);
  const [number,setNumber]= useState(0);
  const [userAnswer,setUserAnswers]= useState<AnswerObject[]>([]);
  const [score,setScore]=useState(0);
  const [gameOver, setGameOver]=useState(true);


 

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL,
      Difficulty.EASY
    )

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver){
      const answer = e.currentTarget.value;

      const correct = questions[number].correct_answer === answer;

      if(correct) setScore(prev => prev+1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev,answerObject]);
    }
  }
  const nextQuestion = () => {
    const nextQuestion = number+1;

    if(nextQuestion === TOTAL){
      setGameOver(true);
    }
    else {
      setNumber(nextQuestion)
    }
  }
  return (
    
   

    
    <div className="App">
      <h1>React quizz</h1>
      { gameOver || userAnswer.length === TOTAL ? (
      <button className='start' onClick={startTrivia}>
        Start
      </button>
      ):null}
      {!gameOver ? <p className='score'>Score : {score}</p> : null}
      {loading && <p>Loading Questions ...</p> } 
      {!loading && !gameOver && questions[number]?.answers && (
      <QuestionCard
        questionNr={number+1}
        totalQuestions={TOTAL}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswer ? userAnswer[number]: undefined}
        callback={checkAnswer}
      />
      )}
      {!gameOver && !loading && userAnswer.length === number+1 && number !== TOTAL-1 ? (
      <button className='next' onClick={nextQuestion}>
        Next Question
      </button>):null}
    </div>
    
    
  );
}

export default App;
