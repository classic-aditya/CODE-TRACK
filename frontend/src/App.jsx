import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Home from './pages/Home'
import AllProblems from './pages/AllProblems'
import AddProblem from './pages/AddProblem'
import ProblemSets from './pages/ProblemSets'
import ProblemDetail from './pages/ProblemDetail'
import Profile from './pages/Profile'
import ViewProblems from './ProblemSets/ViewProblems'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

function PrivatePage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivatePage><Home /></PrivatePage>} />
            <Route path="/all-problems" element={<PrivatePage><AllProblems /></PrivatePage>} />
            <Route path="/add-problem" element={<PrivatePage><AddProblem /></PrivatePage>} />
            <Route path="/problem/:id" element={<PrivatePage><ProblemDetail /></PrivatePage>} />
            <Route path="/problem-sets" element={<PrivatePage><ProblemSets /></PrivatePage>} />
            <Route path="/problem-sets/:setId" element={<PrivatePage><ViewProblems /></PrivatePage>} />
            <Route path="/profile" element={<PrivatePage><Profile /></PrivatePage>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
