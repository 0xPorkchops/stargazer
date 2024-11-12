import SignOut from '../components/SignOut'
import { useNavigate } from 'react-router-dom';
function HomePage(){
    const navigate = useNavigate();
    return (
    <>
        <h1> Welcome to HomePage. </h1>
        <SignOut />
        <button onClick={()=>{navigate('/weather')}}>Weather Map</button>
        
    </>
    )
}

export default HomePage;