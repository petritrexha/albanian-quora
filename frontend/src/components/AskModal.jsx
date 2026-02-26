import React from "react";

const AskModal = ({ newQuestion, setNewQuestion, handlePostQuestion, onClose }) => {
  return (
    /* The container is already wrapped by a themed div in App.jsx, 
       but we ensure the internal text and elements use variables */
    <div className="p-6 flex flex-col gap-4 bg-[var(--card-bg)] transition-colors duration-300">
      <h2 className="m-0 text-[22px] text-center font-semibold text-[var(--text-main)]">
        Posto një pyetje
      </h2>
      
      <textarea
        className="w-full min-h-[140px] p-4 rounded-lg border border-[var(--border)] resize-y text-sm focus:outline-none focus:border-[var(--primary)] transition-all bg-[var(--bg-light)] text-[var(--text-main)] placeholder:text-[var(--text-light)]"
        placeholder="Shkruaj pyetjen tënde këtu..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      
      <div className="flex justify-end gap-3 mt-2">
        {/* Cancel Button - helpful for UX */}
        <button 
          className="px-6 py-2.5 bg-transparent text-[var(--text-light)] border border-[var(--border)] rounded-full font-semibold cursor-pointer hover:bg-[var(--bg-light)] transition-all"
          onClick={onClose}
        >
          Anulo
        </button>

        <button 
          className="px-6 py-2.5 bg-[var(--primary)] text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-150 hover:opacity-90 hover:shadow-lg active:scale-95"
          onClick={handlePostQuestion}
        >
          Posto pyetjen
        </button>
      </div>
    </div>
  );
};

export default AskModal;

// import React from "react";

// const AskModal = ({ newQuestion, setNewQuestion, handlePostQuestion }) => {
//   return (
//     /* We removed bg-white, w-[600px], and shadow-xl because App.jsx handles them */
//     <div className="p-6 flex flex-col gap-4">
//       <h2 className="m-0 text-[22px] text-center font-semibold text-text-main">
//         Posto një pyetje
//       </h2>
      
//       <textarea
//         className="w-full min-h-[140px] p-4 rounded-lg border border-border resize-y text-sm focus:outline-none focus:border-primary transition-all bg-bg-light"
//         placeholder="Shkruaj pyetjen tënde këtu..."
//         value={newQuestion}
//         onChange={(e) => setNewQuestion(e.target.value)}
//       />
      
//       <div className="flex justify-end gap-3 mt-2">
//         {/* Added a cancel hint or extra spacing logic here */}
//         <button 
//           className="px-6 py-2.5 bg-primary text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-150 hover:bg-primary-light hover:shadow-lg active:scale-95"
//           onClick={handlePostQuestion}
//         >
//           Posto pyetjen
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AskModal;