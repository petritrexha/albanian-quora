import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function CreateQuestion() {
  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <Card>
          <h2>Ask a Question</h2>

          <input
            type="text"
            placeholder="Question title..."
            style={styles.input}
          />

          <textarea
            placeholder="Describe your question..."
            style={styles.textarea}
          />

          <button style={styles.button}>
            Submit Question
          </button>
        </Card>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  button: {
    backgroundColor: "var(--primary-btn)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};
