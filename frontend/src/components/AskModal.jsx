import React from "react";

const AskModal = ({ newQuestion, setNewQuestion, handlePostQuestion }) => {
  return (
    <div className="bg-white w-[600px] max-w-[92%] p-6 rounded-xl flex flex-col gap-4 shadow-xl">
      <h2 className="m-0 text-[22px] text-center font-semibold text-[var(--text-main)]">
        Posto një pyetje
      </h2>
      
      <textarea
        className="w-full min-h-[120px] p-3 rounded-lg border border-[#ccc] resize-y text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
        placeholder="Shkruaj pyetjen tënde këtu..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      
      <button 
        className="self-end px-[18px] py-2.5 bg-[#2e69ff] text-white border-none rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[#2350cc]"
        onClick={handlePostQuestion}
      >
        Posto pyetjen
      </button>
    </div>
  );
};

export default AskModal;