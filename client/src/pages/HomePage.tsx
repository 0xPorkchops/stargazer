
import { ThemeStatus } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import "../components/Homepage.css"; // Import the CSS file

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="background-container">
      
      <div className={`stars ${ThemeStatus() ? "hidden" : ""}`}></div>
      <div className={`twinkling ${ThemeStatus() ? "hidden" : ""}`}></div>
      {/* Centered content */}
      <div className="content-layer">
        {ThemeStatus() ? (<img src="/logored.png" alt="Star Gazers Logo" className="logo"/>) : (<img src="/logowhite.png" alt="Star Gazers Logo" className="logo"/>)}
        <p className="text-[3rem] mt-4">Welcome to StarGazer!</p>
        <input type="button" value="Click here" onClick={()=>navigate('/starmap')}></input>
      </div>
    </div>
  );
}

export default HomePage;
