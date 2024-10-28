import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'

function App() {
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

    const data = await response.json();
    setUserData(data);
  }

  return (
    <>
      <div className="bg-green-500">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="bg-green-500">Vite + React</h1>
      <Button onClick={fetchUserData}>Fetch User Data</Button>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <div className="card">
      </div>
      {userData && (
        <div className="user-data">
          <h2>User Data:</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default App
