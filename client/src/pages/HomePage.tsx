import SignOut from '../components/SignOut'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
function HomePage(){
    const navigate = useNavigate();
    return (
    <>
        <h1> Welcome to HomePage. </h1>
        <SignOut />
        <Button onClick={()=>{navigate('/weather')}}>Weather Map</Button>
        <Button onClick={()=>{navigate('/locationtest')}}>Testing</Button>
        
    </>
    )
}

export default HomePage;