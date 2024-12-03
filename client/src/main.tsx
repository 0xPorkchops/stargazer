import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './AppRoutes.tsx'
import "./css/index.css"
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout'
import { ClerkProvider} from '@clerk/clerk-react'
import { ThemeProvider } from "@/components/theme-provider"

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/" appearance={{variables: {colorPrimary: 'hsl(221, 83%, 53%)'}}}>
        <BrowserRouter>
          <Layout>
            <AppRoutes/>
          </Layout>
        </BrowserRouter>
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>,
)
