import Navbar from "../components/Navbar";
import AskBox from "../components/AskBox";
import QuestionCard from "../components/QuestionCard";
import Sidebar from "../components/Sidebar";
import "../styles/home.css";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="content-layout">
        {/* LEFT */}
        <Sidebar />

        {/* CENTER */}
        <div className="questions-section">
          <AskBox />

          <h2>Trending Questions</h2>

          <QuestionCard />
          <QuestionCard />
          <QuestionCard />
        </div>
      </div>
    </>
  );
};

export default Home;

