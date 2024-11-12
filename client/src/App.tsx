import LoginPage from './pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { useAuth } from '@clerk/clerk-react'

function App() {
  const { isSignedIn } = useAuth();


  return (
  <>
    {isSignedIn ? (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter> ) : (
    <LoginPage />)
    }
  </>)
}




export default App
