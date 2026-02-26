import { useState } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";
import { FaBookmark, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";

const Bookmarks = () => {
  const {
    bookmarkedQuestions,
    bookmarkedAnswers,
    toggleQuestionBookmark,
    toggleAnswerBookmark,
  } = useBookmarks();

  const [activeTab, setActiveTab] = useState("questions");
  
  // Safety check: ensure arrays exist before calling .length
  const qCount = bookmarkedQuestions?.length || 0;
  const aCount = bookmarkedAnswers?.length || 0;
  const totalCount = qCount + aCount;

  return (
    <div className="max-w-[950px] mx-auto my-8 px-4 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <FaBookmark className="text-[var(--primary)] text-[22px]" />
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Bookmark-et e mia</h1>
        <span className="bg-[var(--accent)] text-[var(--primary)] text-[13px] px-2.5 py-1 rounded-full">
          {totalCount} gjithsej
        </span>
      </div>

      {/* Tabs - Replaced bg-[#f3f4f6] with var(--accent) */}
      <div className="flex gap-1.5 bg-[var(--accent)] p-1.5 rounded-xl max-w-[420px] mb-6">
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm transition-all duration-150 ${
            activeTab === "questions"
            ? "bg-[var(--card-bg)] text-[var(--primary)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
            : "bg-transparent text-[var(--text-light)]"
          }`}
        >
          Pyetjet ({qCount})
        </button>
        <button
          onClick={() => setActiveTab("answers")}
          className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm transition-all duration-150 ${
            activeTab === "answers"
            ? "bg-[var(--card-bg)] text-[var(--primary)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
            : "bg-transparent text-[var(--text-light)]"
          }`}
        >
          Përgjigjet ({aCount})
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3.5">
        {activeTab === "questions" ? (
          qCount === 0 ? (
            <EmptyState
              message="Nuk keni pyetje të ruajtura."
              sub="Kliko ikonën e bookmark-it në ndonjë pyetje për ta ruajtur këtu."
            />
          ) : (
            bookmarkedQuestions.map((question) => (
              <BookmarkedQuestionCard
                key={question.id}
                question={question}
                onRemove={() => toggleQuestionBookmark(question)}
              />
            ))
          )
        ) : (
          aCount === 0 ? (
            <EmptyState
              message="Nuk keni përgjigje të ruajtura."
              sub="Kliko ikonën e bookmark-it në ndonjë përgjigje për ta ruajtur këtu."
            />
          ) : (
            bookmarkedAnswers.map((answer) => (
              <BookmarkedAnswerCard
                key={answer.id}
                answer={answer}
                onRemove={() => toggleAnswerBookmark(answer)}
              />
            ))
          )
        )}
      </div>
    </div>
  );
};

/* ── Bookmarked Question Card - Replaced bg-white with var(--card-bg) ── */
const BookmarkedQuestionCard = ({ question, onRemove }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md">
    <div className="flex flex-col items-center gap-1 min-w-[50px] text-[var(--text-light)]">
      <FaArrowUp />
      <span className="font-semibold text-[var(--text-main)]">{question.votes}</span>
      <FaArrowDown />
    </div>

    <div className="flex-1 min-w-0">
      <Link to={`/question/${question.id}`} className="text-base font-semibold text-[var(--text-main)] no-underline hover:underline">
        {question.title}
      </Link>
      <p className="text-sm text-[var(--text-light)] mt-1 mb-0 leading-relaxed line-clamp-2">
        {question.content}
      </p>
      <div className="text-[12px] text-[var(--text-light)] mt-2">
        <span>{question.views} shikime</span>
        <span className="mx-1">•</span>
        <span>{question.answers} përgjigje</span>
      </div>
    </div>

    <button
      onClick={(e) => { e.preventDefault(); onRemove(); }}
      className="p-1.5 rounded-md text-[var(--text-light)] hover:bg-red-500/10 hover:text-red-500 transition-colors self-start"
      title="Hiq nga bookmark-et"
    >
      <FaTrash />
    </button>
  </div>
);

/* ── Bookmarked Answer Card ── */
const BookmarkedAnswerCard = ({ answer, onRemove }) => (
  <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex gap-4 transition-all duration-200">
    <div className="flex flex-col items-center gap-1 min-w-[50px] text-[var(--text-light)]">
      <FaArrowUp />
      <span className="font-semibold text-[var(--text-main)]">{answer.votes}</span>
      <FaArrowDown />
    </div>

    <div className="flex-1 min-w-0">
      {answer.questionTitle && (
        <p className="text-[12px] text-[var(--text-light)] m-0">
          Nga pyetja: <span className="text-[var(--primary)] font-medium">{answer.questionTitle}</span>
        </p>
      )}

      <div className="flex items-center gap-2 my-1.5">
        <div className="w-[26px] h-[26px] rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[11px] font-bold">
          {answer.author ? answer.author[0] : "U"}
        </div>
        <span className="text-sm font-medium text-[var(--text-main)]">{answer.author}</span>
      </div>

      <p className="text-sm text-[var(--text-light)] m-0 leading-relaxed line-clamp-3">
        {answer.content}
      </p>
    </div>

    <button
      onClick={(e) => { e.preventDefault(); onRemove(); }}
      className="p-1.5 rounded-md text-[var(--text-light)] hover:bg-red-500/10 hover:text-red-500 transition-colors self-start"
    >
      <FaTrash />
    </button>
  </div>
);

const EmptyState = ({ message, sub }) => (
  <div className="text-center py-14 px-5">
    <div className="w-[60px] h-[60px] mx-auto mb-3.5 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--primary)] text-[26px]">
      <FaBookmark />
    </div>
    <p className="font-semibold text-[var(--text-main)] m-0">{message}</p>
    <p className="text-[13px] text-[var(--text-light)] mt-1 m-0">{sub}</p>
  </div>
);

export default Bookmarks;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useBookmarks } from "../context/BookmarkContext";
// import { FaBookmark, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";

// const Bookmarks = () => {
//   const {
//     bookmarkedQuestions,
//     bookmarkedAnswers,
//     toggleQuestionBookmark,
//     toggleAnswerBookmark,
//   } = useBookmarks();

//   const [activeTab, setActiveTab] = useState("questions");
//   const totalCount = bookmarkedQuestions.length + bookmarkedAnswers.length;

//   return (
//     <div className="max-w-[950px] mx-auto my-8 px-4">
//       {/* Header */}
//       <div className="flex items-center gap-2.5 mb-6">
//         <FaBookmark className="text-[var(--primary)] text-[22px]" />
//         <h1 className="text-2xl font-bold text-[var(--text-main)]">Bookmark-et e mia</h1>
//         <span className="bg-[var(--accent)] text-[var(--primary)] text-[13px] px-2.5 py-1 rounded-full">
//           {totalCount} gjithsej
//         </span>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1.5 bg-[var(--accent)] p-1.5 rounded-xl max-w-[420px] mb-6">
//         <button
//           onClick={() => setActiveTab("questions")}
//           className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm transition-all duration-150 ${
//             activeTab === "questions" 
//             ? "bg-[var(--card-bg)] text-[var(--primary)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]" 
//             : "bg-transparent text-[var(--text-light)]"
//           }`}
//         >
//           Pyetjet ({bookmarkedQuestions.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("answers")}
//           className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm transition-all duration-150 ${
//             activeTab === "answers" 
//             ? "bg-[var(--card-bg)] text-[var(--primary)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]" 
//             : "bg-transparent text-[var(--text-light)]"
//           }`}
//         >
//           Përgjigjet ({bookmarkedAnswers.length})
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex flex-col gap-3.5">
//         {activeTab === "questions" ? (
//           bookmarkedQuestions.length === 0 ? (
//             <EmptyState
//               message="Nuk keni pyetje të ruajtura."
//               sub="Kliko ikonën e bookmark-it në ndonjë pyetje për ta ruajtur këtu."
//             />
//           ) : (
//             bookmarkedQuestions.map((question) => (
//               <BookmarkedQuestionCard
//                 key={question.id}
//                 question={question}
//                 onRemove={() => toggleQuestionBookmark(question)}
//               />
//             ))
//           )
//         ) : (
//           bookmarkedAnswers.length === 0 ? (
//             <EmptyState
//               message="Nuk keni përgjigje të ruajtura."
//               sub="Kliko ikonën e bookmark-it në ndonjë përgjigje për ta ruajtur këtu."
//             />
//           ) : (
//             bookmarkedAnswers.map((answer) => (
//               <BookmarkedAnswerCard
//                 key={answer.id}
//                 answer={answer}
//                 onRemove={() => toggleAnswerBookmark(answer)}
//               />
//             ))
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// /* ── Bookmarked Question Card ── */
// const BookmarkedQuestionCard = ({ question, onRemove }) => (
//   <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md">
//     <div className="flex flex-col items-center gap-1 min-w-[50px] text-[var(--text-light)]">
//       <FaArrowUp />
//       <span className="font-semibold text-[var(--text-main)]">{question.votes}</span>
//       <FaArrowDown />
//     </div>

//     <div className="flex-1 min-w-0">
//       <Link to={`/question/${question.id}`} className="text-base font-semibold text-[var(--text-main)] no-underline hover:underline">
//         {question.title}
//       </Link>
//       <p className="text-sm text-[var(--text-light)] mt-1 mb-0 leading-relaxed line-clamp-2">
//         {question.content}
//       </p>
//       <div className="text-[12px] text-[var(--text-light)] mt-2">
//         <span>{question.views} shikime</span>
//         <span className="mx-1">•</span>
//         <span>{question.answers} përgjigje</span>
//       </div>
//     </div>

//     <button
//       onClick={onRemove}
//       className="p-1.5 rounded-md text-[var(--text-light)] hover:bg-red-500/10 hover:text-red-500 transition-colors self-start"
//       title="Hiq nga bookmark-et"
//     >
//       <FaTrash />
//     </button>
//   </div>
// );

// /* ── Bookmarked Answer Card ── */
// const BookmarkedAnswerCard = ({ answer, onRemove }) => (
//   <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 flex gap-4 transition-all duration-200 hover:shadow-md">
//     <div className="flex flex-col items-center gap-1 min-w-[50px] text-[var(--text-light)]">
//       <FaArrowUp />
//       <span className="font-semibold text-[var(--text-main)]">{answer.votes}</span>
//       <FaArrowDown />
//     </div>

//     <div className="flex-1 min-w-0">
//       {answer.questionTitle && (
//         <p className="text-[12px] text-[var(--text-light)] m-0">
//           Nga pyetja: <span className="text-[var(--primary)] font-medium">{answer.questionTitle}</span>
//         </p>
//       )}

//       <div className="flex items-center gap-2 my-1.5">
//         <div className="w-[26px] h-[26px] rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[11px] font-bold">
//           {answer.author[0]}
//         </div>
//         <span className="text-sm font-medium text-[var(--text-main)]">{answer.author}</span>
//       </div>

//       <p className="text-sm text-[var(--text-light)] m-0 leading-relaxed line-clamp-3">
//         {answer.content}
//       </p>
//     </div>

//     <button
//       onClick={onRemove}
//       className="p-1.5 rounded-md text-[var(--text-light)] hover:bg-red-500/10 hover:text-red-500 transition-colors self-start"
//       title="Hiq nga bookmark-et"
//     >
//       <FaTrash />
//     </button>
//   </div>
// );

// /* ── Empty State ── */
// const EmptyState = ({ message, sub }) => (
//   <div className="text-center py-14 px-5">
//     <div className="w-[60px] h-[60px] mx-auto mb-3.5 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--primary)] text-[26px]">
//       <FaBookmark />
//     </div>
//     <p className="font-semibold text-[var(--text-main)] m-0">{message}</p>
//     <p className="text-[13px] text-[var(--text-light)] mt-1 m-0">{sub}</p>
//   </div>
// );

// export default Bookmarks;
