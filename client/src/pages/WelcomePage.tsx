import { ThemeStatus } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react';
import "../css/welcome.css"

function HomePage() {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState<string | null>(null);

  const makeUser = async () => {
    try {
      if (isLoaded && isSignedIn) {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _firstname: user.firstName,
            _lastname: user.lastName,
            _username: user.fullName,
            _email: user.emailAddresses[0].emailAddress,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const userData = await response.json();
        console.log("Response from user API:", userData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.log(error);
    }
  };
  
  makeUser();

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
