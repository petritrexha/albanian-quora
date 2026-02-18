import { useEffect, useState } from "react";
import AskModal from "../components/AskModal";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";
import Sidebar from "../components/Sidebar";
import { getQuestions } from "../services/questionService";
import "../styles/home.css";

const Home = ({ showAskModal, setShowAskModal }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    getQuestions().then((data) => setQuestions(data));
  }, []);

  const handleUpvote = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, votes: q.votes + 1 } : q
      )
    );
  };

  const handleDownvote = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, votes: q.votes - 1 } : q
      )
    );
  };

  const handlePostQuestion = () => {
    if (newQuestion.trim() === "") return;

    const question = {
      id: Date.now(),
      title: newQuestion,
      description: "Pyetja sapo u postua.",
      votes: 0,
      views: 0,
      answers: 0,
    };

    setQuestions([question, ...questions]);
    setNewQuestion("");
    setShowAskModal(false);
  };

  return (
    <>
      <div className="content-layout">
        <Sidebar />

        <div className="questions-section">
          <AskBox
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            handlePostQuestion={handlePostQuestion}
          />

          <h2>Trending Questions</h2>

          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
            />
          ))}
        </div>
      </div>

      {showAskModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAskModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <AskModal
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              handlePostQuestion={handlePostQuestion}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;


