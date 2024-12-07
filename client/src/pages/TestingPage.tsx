import { Settings } from '@/components/Settings';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
export default function TestingPage(){
    const navigate = useNavigate();
    return (<>
        {/* <Settings /> */}
        <Button onClick={()=>{navigate('/testing')}}>Location Test</Button>
    </>)
}