import { useAuth } from '@clerk/clerk-react';
import { Button } from './ui/button';
function SignOutButton(){
    const { signOut } = useAuth();
    const handleLogout = () => {
            signOut(); 
    };
    return (
        <>
            <Button onClick={handleLogout}>Sign Out</Button>
        </>
    )
}

export default SignOutButton;