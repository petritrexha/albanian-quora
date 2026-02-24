import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import AnswerCard from "../components/AnswerCard";
import { getQuestionById, upvoteQuestion, downvoteQuestion } from "../services/questionService";
import {
  createAnswer,
  getAnswersByQuestionId,
  upvoteAnswer,
  downvoteAnswer,
} from "../services/answerService";

const QuestionDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const viewLogged = useRef(false);

  const localQuestion = location.state?.question || null;
  const [question, setQuestion] = useState(localQuestion);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  useEffect(() => {
    let mounted = true;
    const questionId = Number(id);

    getQuestionById(questionId, user?.id)
      .then((data) => {
        if (mounted) {
          setQuestion(data);
          viewLogged.current = true;
        }
      })
      .catch(() => {
        if (mounted) {
          setQuestion({
            id: questionId,
            title: `Error loading question`,
            content: "Nuk u gjet asgjë.",
            votes: 0,
            views: 0,
          });
        }
      });

    return () => { mounted = false; };
  }, [id, user?.id]);

  useEffect(() => {
    if (!question?.id) return;
    let mounted = true;
    setLoadingAnswers(true);
    getAnswersByQuestionId(question.id)
      .then((data) => { if (mounted) setAnswers(data || []); })
      .catch(() => { if (mounted) setAnswers([]); })
      .finally(() => { if (mounted) setLoadingAnswers(false); });
    return () => { mounted = false; };
  }, [question?.id]);

  const handleQuestionVote = async (dir) => {
    try {
      const newVotes = dir === 'up' ? await upvoteQuestion(question.id) : await downvoteQuestion(question.id);
      setQuestion(prev => ({ ...prev, votes: newVotes }));
    } catch (err) {
      console.error("Question vote failed", err);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;
    try {
      await createAnswer(question.id, { content: newAnswer });
      const freshAnswers = await getAnswersByQuestionId(question.id);
      setAnswers(freshAnswers);
      setNewAnswer("");
    } catch (err) {
      console.error("Error creating answer:", err);
      alert("Ndodhi një gabim gjatë dërgimit të përgjigjes.");
    }
  };

  const handleUpvote = async (answerId) => {
    try {
      const newVotes = await upvoteAnswer(answerId);
      setAnswers(prev => prev.map((a) => a.id === answerId ? { ...a, votes: newVotes } : a));
    } catch (err) { console.error("Upvote failed", err); }
  };

  const handleDownvote = async (answerId) => {
    try {
      const newVotes = await downvoteAnswer(answerId);
      setAnswers(prev => prev.map((a) => a.id === answerId ? { ...a, votes: newVotes } : a));
    } catch (err) { console.error("Downvote failed", err); }
  };

  if (!question) return <div className="p-10 text-center text-gray-500">Duke ngarkuar...</div>;

  return (
    <div className="min-h-screen bg-[#f0f2f7] py-10 px-4 font-sans">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        
        {/* Question Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition-transform duration-200 hover:-translate-y-0.5">
          {/* Voting Column */}
          <div className="flex flex-col items-center gap-1 min-w-[40px]">
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-[#2e69ff] transition-all"
              onClick={() => handleQuestionVote('up')}
            >
              <FaArrowUp />
            </button>
            <span className="font-bold text-lg text-gray-800">{question.votes}</span>
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-[#cb4b10] transition-all"
              onClick={() => handleQuestionVote('down')}
            >
              <FaArrowDown />
            </button>
          </div>

          {/* Question Body */}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-[#282829] mb-3 leading-tight">
              {question.title}
            </h1>
            <p className="text-[1.05rem] leading-relaxed text-[#3e4143] mb-5 whitespace-pre-wrap">
              {question.content}
            </p>
            <div className="flex items-center gap-2 text-sm text-[#939598]">
              <span>{question.views} shikime</span>
              <span>•</span>
              <span>{answers.length} përgjigje</span>
            </div>
          </div>
        </div>

        {/* Answers Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#2e69ff] px-2">Përgjigjet</h2>
          
          {loadingAnswers ? (
            <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 italic">
              Duke ngarkuar përgjigjet...
            </div>
          ) : answers.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 italic">
              Ende nuk ka përgjigje.
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5">
                <AnswerCard
                  answer={answer}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  questionTitle={question.title}
                />
              </div>
            ))
          )}

          {/* Add Answer Box */}
          {user ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Shto përgjigje</h3>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 text-base focus:outline-none focus:border-[#2e69ff] focus:ring-2 focus:ring-[#2e69ff]/20 transition-all"
                placeholder="Shkruaj përgjigjen tënde..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <button 
                className="bg-[#2e69ff] text-white px-6 py-3 rounded-lg font-bold self-start hover:bg-[#2350cc] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                onClick={handleAddAnswer}
              >
                Dërgo përgjigjen
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-600 mt-4">
              Duhet të jesh i kyçur për të shtuar përgjigje. 
              <Link to="/login" className="text-[#2e69ff] font-semibold ml-1 hover:underline">Kyçu këtu</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;