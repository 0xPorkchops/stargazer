import { ThemeStatus } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className = "flex flex-col items-center justify-center min-h-screen">
        {ThemeStatus() ? <img src="/logored.png" alt="Star Gazers Logo" className="h-40 sm:h-30 mr-4" /> : <img src="/logowhite.png" alt="Star Gazers Logo" className="h-40 sm:h-30 mr-4" />}
        <p className="text-[3rem] mt-4">Welcome to StarGazer!</p>
        <input type="button" value="Click here" onClick={()=>navigate('/starmap')}></input>
      </div>
    </div>
  )
}

export default HomePage