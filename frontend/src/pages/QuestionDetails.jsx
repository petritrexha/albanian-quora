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
            content: "Nuk u gjet asnjë.",
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

  if (!question) return <div className="p-10 text-center text-[var(--text-light)]">Duke ngarkuar...</div>;

  return (
    <div className="min-h-screen py-10 px-4 font-sans transition-colors duration-300
                    bg-slate-50 dark:bg-slate-900">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        
        {/* Question Section */}
        <div className="p-8 rounded-xl shadow-sm flex gap-4 transition-all duration-200 hover:-translate-y-0.5
                        bg-white border border-slate-200
                        dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/90 dark:border-slate-700/50">
          {/* Voting Column */}
          <div className="flex flex-col items-center gap-1 min-w-[40px]">
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full text-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400 transition-all"
              onClick={() => handleQuestionVote('up')}
            >
              <FaArrowUp />
            </button>
            <span className="font-bold text-lg text-slate-800 dark:text-white">{question.votes}</span>
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full text-xl text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-700 dark:hover:text-red-400 transition-all"
              onClick={() => handleQuestionVote('down')}
            >
              <FaArrowDown />
            </button>
          </div>

          {/* Question Body */}
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3 leading-tight">
              {question.title}
            </h1>
            <p className="text-[1.05rem] leading-relaxed text-slate-700 dark:text-slate-300 mb-5 whitespace-pre-wrap">
              {question.content}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
              <span>{question.views} shikime</span>
              <span>•</span>
              <span>{answers.length} përgjigje</span>
            </div>
            
            <div className="flex items-center justify-between gap-3 mt-3">
              {/* Tags */}
              {question.tags && question.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tagName) => (
                    <Link
                      key={tagName}
                      to={`/?tag=${encodeURIComponent(tagName)}`}
                      className="text-sm px-2.5 py-1 rounded-full transition-colors
                                 bg-blue-50 text-blue-600 hover:bg-blue-100
                                 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30"
                    >
                      {tagName}
                    </Link>
                  ))}
                </div>
              ) : (
                <div />
              )}
              
              {/* Username */}
              {question.username && (
                <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-800
                                  text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                    {question.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{question.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answers Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 px-2">Përgjigjet</h2>
          
          {loadingAnswers ? (
            <div className="p-6 rounded-lg text-center italic transition-all
                            bg-white border border-dashed border-slate-200 text-slate-500
                            dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
              Duke ngarkuar përgjigjet...
            </div>
          ) : answers.length === 0 ? (
            <div className="p-6 rounded-lg text-center italic transition-all
                            bg-white border border-dashed border-slate-200 text-slate-500
                            dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
              Ende nuk ka përgjigje.
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="rounded-xl shadow-sm p-1 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5
                                              bg-white border border-slate-200
                                              dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/80 dark:border-slate-700/50">
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
            <div className="p-8 rounded-xl shadow-sm flex flex-col gap-4 mt-4 transition-all
                            bg-white border border-slate-200
                            dark:bg-gradient-to-br dark:from-slate-800 dark:to-indigo-900/20 dark:border-slate-700/50">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Shto përgjigje</h3>
              <textarea
                className="w-full min-h-[120px] p-4 rounded-lg text-base transition-all
                           border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400
                           dark:border-slate-600 dark:bg-slate-700/50 dark:text-white
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Shkruaj përgjigjen tënde..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:to-pink-600 text-white px-6 py-3 rounded-lg font-bold self-start hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
                onClick={handleAddAnswer}
              >
                Dërgo përgjigjen
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-lg text-center mt-4 transition-all
                            bg-white border border-dashed border-slate-200 text-slate-500
                            dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
              Duhet të jesh i kyçur për të shtuar përgjigje. 
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold ml-1 hover:underline">Kyçu këtu</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;