import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";
import { getQuestions, createQuestion, upvoteQuestion, downvoteQuestion } from "../services/questionService";

const Home = ({ selectedCategory, refreshTrigger }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    getQuestions(user?.id, selectedCategory)
      .then((data) => {
        if (mounted && data) setQuestions(data);
      })
      .catch(() => {
        if (mounted) setQuestions([]);
      });
    return () => { mounted = false; };
  }, [user, selectedCategory, refreshTrigger]);

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      const created = await createQuestion({
        title: newQuestion,
        description: newQuestion,
        categoryId: selectedCategory || 1,
      });
      setQuestions((prev) => [created, ...prev]);
      setNewQuestion("");
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const newVotes = await upvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const handleDownvote = async (id) => {
    try {
      const newVotes = await downvoteQuestion(id);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, votes: newVotes } : q))
      );
    } catch (err) {
      console.error("Downvote failed", err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <AskBox
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handlePostQuestion={handlePostQuestion}
        />
        
        <h2 className="my-1.5 mb-3 text-[20px] font-semibold text-[var(--text-main)]">
          Trending Questions
        </h2>

        {questions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-light)] italic text-sm">No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;