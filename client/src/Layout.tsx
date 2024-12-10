import { Settings } from '@/components/Settings'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Link, useLocation } from "react-router-dom";
import { ThemeStatus } from './lib/utils';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';
  return (
    <>
        {!isWelcomePage && (
        <header className="sticky top-0 z-10 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center mb-4 sm:mb-0">
                {ThemeStatus() ? <img src="/logored.png" alt="Star Gazers Logo" className="h-20 sm:h-30 mr-4" /> : <img src="/logowhite.png" alt="Star Gazers Logo" className="h-20 sm:h-30 mr-4" />}
            </div>
            {/* Navigation Tabs */}
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-5">
                <Button asChild variant="ghost" className=""><Link to="/events" className="px-3 py-2 rounded-md text-base font-medium">Events</Link></Button>
                <Button asChild variant="ghost" className=""><Link to="/starmap" className="px-3 py-2 rounded-md text-base font-medium">Star Map</Link></Button>
                <Button asChild variant="ghost" className=""><Link to="/aurora" className="px-3 py-2 rounded-md text-base font-medium">Aurora</Link></Button>
                <Button asChild variant="ghost" className=""><Link to="/weather" className="px-3 py-2 rounded-md text-base font-medium">Weather</Link></Button>
            </nav>
            {/* User Actions */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <ModeToggle />
            <SignedOut>
                <SignInButton forceRedirectUrl="/" signUpForceRedirectUrl="/" mode='modal'>
                  <Button variant="default">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Settings />
                <UserButton />
              </SignedIn>
            </div>
            </div>
        </div>
        </header>
        )}
        <main>
            {children}
        </main>
        <Toaster />
    </>
  )
}

export default Layout