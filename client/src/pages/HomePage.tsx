import { ThemeStatus } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

function HomePage() {
  const navigate = useNavigate();
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