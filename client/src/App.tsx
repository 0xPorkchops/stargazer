
import { Button } from './components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

function App() {
 

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
         <a href="#" className="hover:text-gray-300">Weather & Star Map</a>
         <a href="#" className="hover:text-gray-300">Events </a>
         <a href="#" className="hover:text-gray-300">Home</a>
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

    </>
  )
}

export default App
