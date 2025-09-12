import './app.css';
import { version } from "./version";
import Patient from "./components/patient";
import ErrorBoundary from "./components/ErrorBoundary";
import UserProfile from "./components/UserProfile";
import LoginComponent from "./components/LoginComponent";
import { useScrollDirection } from "./hooks/useScrollDirection";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "./auth/AuthProvider";
import orgLogo from './assets/org.png';
import appLogo from './assets/app.png';

function App() {
  const { isAtBottom } = useScrollDirection();
  // Show version only when user has scrolled to the bottom
  const isVersionVisible = isAtBottom;

  return (
    <main className="p-8 flex flex-col min-h-screen">
      <UnauthenticatedTemplate>
        <LoginComponent />
      </UnauthenticatedTemplate>
      
      <AuthenticatedTemplate>
        <header className="my-6">
          <div className="absolute top-8 left-4 md:left-12 z-50 logo-container flex items-center">
            <img 
              src={orgLogo} 
              alt="orgLogo"
              className="org-logo"
            />
            {/*
              <div className="logo-divider"></div> 
              <img 
              src={appLogo} 
              alt="appLogo" />*/}
          </div>
          <div className="absolute top-8 right-4 md:right-20 z-50">
            <UserProfile />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8">
          <section className="w-full max-w-none lg:max-w-7xl xl:max-w-none mx-auto flex-grow mt-8 lg:mt-0">
            <div className="bg-white shadow-md rounded lg:mx-4">
              <div className="p-4 lg:p-8">
                <ErrorBoundary>
                  <Patient />
                </ErrorBoundary>
              </div>
            </div>
            <div>
            </div>
          </section>
        </div>

        <footer>
          <div 
            className={`fixed right-12 bottom-2 text-gray-400 text-xs font-mono z-40 transition-all duration-200 ease-in-out pointer-events-none ${
              isVersionVisible ? 'opacity-70' : 'opacity-0'
            }`}
          >
            v{version} @Clinical Data Science
          </div>
        </footer>
      </AuthenticatedTemplate>
    </main>
  );
}

export default App;