import { Settings } from '@/components/Settings'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Link } from "react-router-dom";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <header className="sticky top-0 z-10 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center mb-4 sm:mb-0">
                <img src="/SGlogo2.png" alt="Star Gazers Logo" className="h-16 sm:h-24 mr-4" />
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-5">
                <Button asChild variant="ghost" className=""><Link to="/starmap" className="px-3 py-2 rounded-md text-base font-medium">Star Map</Link></Button>
                <Button asChild variant="ghost" className=""><Link to="/weather" className="px-3 py-2 rounded-md text-base font-medium">Weather</Link></Button>
                <Button asChild variant="ghost"><Link to="/locationtest" className="px-3 py-2 rounded-md text-base font-medium">Location Test</Link></Button>
                <Button asChild variant="ghost"><Link to="/" className="px-3 py-2 rounded-md text-base font-medium">Home</Link></Button>
            </nav>

            {/* User Actions */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <ModeToggle />
            <SignedOut>
                <SignInButton>
                  <Button variant="secondary">
                    Sign Up
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
        <main>
            {children}
        </main>
    </>
  )
}

export default Layout