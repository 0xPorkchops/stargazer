
import { ThemeStatus } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="background-container">

      {!ThemeStatus() && <div className="stars"></div>}
      {!ThemeStatus() && <div className="twinkling"></div>}
      {/* Centered content */}
      <div className="content-layer animate-fade-in">
        {ThemeStatus() ? (<img src="/logored.png" alt="Star Gazers Logo" className="logo"/>) : (<img src="/logowhite.png" alt="Star Gazers Logo" className="logo"/>)}
        <p className="text-[3rem] mt-4 animate-resize-text">Welcome to StarGazer!</p>
        <input type="button" value="Click here" onClick={()=>navigate('/starmap')}></input>
      </div>
    </div>
  );
}

export default HomePage;
