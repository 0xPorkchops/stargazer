import { ThemeStatus } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { useUser } from '@clerk/clerk-react'
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser()

  const makeUser = async () => {
    try{
      if (isLoaded && isSignedIn) {
        const userData = await axios.get('http://localhost:3000/api/user', {
          params: {
            _firstname: user.firstName,
            _lastname: user.lastName,
            _username: user.fullName,
            _email: user.emailAddresses[0].emailAddress,
          },
        });
        console.log("fetched user data:", userData);
      }
    } 
    catch(err){
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }
  
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