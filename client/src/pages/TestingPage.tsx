import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
export default function TestingPage(){
    const navigate = useNavigate();
    return (<>
        <Button onClick={()=>{navigate('/testing')}}>Location Test</Button>
    </>)
}