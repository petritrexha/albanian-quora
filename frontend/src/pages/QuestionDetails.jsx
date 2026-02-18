import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AnswerCard from "../components/AnswerCard";
import { getQuestionById } from "../services/questionService";
import "../styles/questionDetails.css";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([
    {
      id: 1,
      author: "Bajram Gashi",
      content:
        "Virtual DOM është një kopje e DOM-it real që React e përdor për të përditësuar UI-n më shpejt.",
      votes: 8,
    },
  ]);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    getQuestionById(id).then((data) => setQuestion(data));
  }, [id]);

  const handleAddAnswer = () => {
    if (newAnswer.trim() === "") return;
    const answer = { id: Date.now(), author: "Ti", content: newAnswer, votes: 0 };
    setAnswers([...answers, answer]);
    setNewAnswer("");
  };

  const handleUpvote = (id) => {
    setAnswers(
      answers.map((a) => (a.id === id ? { ...a, votes: a.votes + 1 } : a))
    );
  };

  const handleDownvote = (id) => {
    setAnswers(
      answers.map((a) => (a.id === id ? { ...a, votes: a.votes - 1 } : a))
    );
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="question-details-page">
      <div className="question-main">
        <div className="question-header">
          <h1>{question.title}</h1>
          <p className="question-description">{question.description}</p>
          <div className="question-meta">
            <span>{question.views} shikime</span>
            <span>•</span>
            <span>{answers.length} përgjigje</span>
          </div>
        </div>

        <div className="answers-section">
          <h2>Përgjigjet</h2>
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              questionTitle={question.title}
            />
          ))}
        </div>

        <div className="add-answer">
          <h3>Shto përgjigje</h3>
          <textarea
            placeholder="Shkruaj përgjigjen tënde..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <button onClick={handleAddAnswer}>Dërgo përgjigjen</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
