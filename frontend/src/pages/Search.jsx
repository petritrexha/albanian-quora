import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function Search() {
  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Search Results</h2>

        <Card>
          <h3>How should we structure a .NET + React repo?</h3>
          <p>Some preview text of the question...</p>
        </Card>

        <Card>
          <h3>What is the cleanest DB schema for Q&A?</h3>
          <p>Preview text here...</p>
        </Card>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
  },
};
