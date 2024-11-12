
import { useState } from 'react'
import { Button } from '../components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'


function LoginPage() {
  const [userData, setUserData] = useState(null);
  const { getToken } = useAuth();

  async function fetchUserData() {
    
    const token = await getToken();
  
    const response = await fetch('http://localhost:3000/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',  // If your backend uses cookies for session
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  
    const userData = await response.json();
    setUserData(userData);
  }
  
  return (
    <>
      <header className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white">
       {/* Logo */}
       <div className="flex items-center">
         <img src="SGlogo2.png" alt="Logo" className="h-24 mr-10" />
         <h1 className="text-xl font-bold"></h1>
       </div>


       {/* Navigation Links */}
       <nav className="flex space-x-6">
         <Button onClick={()=>{
          console.log("WOW")}} className="hover:text-gray-300">Weather & Star Map</Button>
         <Button className="hover:text-gray-300">Events </Button>
         <Button className="hover:text-gray-300">Home</Button>
       </nav>


       {/* Authentication Buttons */}
       <div className="flex items-center space-x-4">
         <SignedOut>
           <SignInButton>
             <Button className="bg-blue-500 text-white px-4 py-2 rounded">
               Sign Up
             </Button>
           </SignInButton>
         </SignedOut>
         <SignedIn>
           <UserButton />
         </SignedIn>
       </div>
     </header>
    <Button onClick={fetchUserData}>Fetch User Data</Button>
    {userData && (
        <div className="user-data">
          <h2>User Data:</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
    )}
    </>
  )
}

export default LoginPage
