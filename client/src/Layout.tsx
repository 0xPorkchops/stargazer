import { Settings } from '@/components/settings'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <header className="sticky top-0 z-10 bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center mb-4 sm:mb-0">
                <img src="/SGlogo2.png" alt="Star Gazers Logo" className="h-16 sm:h-24 mr-4" />
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-5">
                <a href="/starmap" className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Weather & Star Map</a>
                <a href="/locationtest" className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Location Test </a>
                <a href="/" className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Home</a>
            </nav>

            {/* User Actions */}
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
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