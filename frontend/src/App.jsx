import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import AllProblems from './pages/AllProblems';
import AddProblem from './pages/AddProblem';
import ProblemSets from './pages/ProblemSets';
import ProblemDetail from './pages/ProblemDetail';
import Profile from './pages/Profile';
import ViewProblems from './ProblemSets/ViewProblems';
import './index.css';

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

const P = ({ children }) => (
  <ProtectedRoute><AppLayout>{children}</AppLayout></ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<P><Home /></P>} />
          <Route path="/all-problems" element={<P><AllProblems /></P>} />
          <Route path="/add-problem" element={<P><AddProblem /></P>} />
          <Route path="/problem/:id" element={<P><ProblemDetail /></P>} />
          <Route path="/problem-sets" element={<P><ProblemSets /></P>} />
          <Route path="/problem-sets/:setId" element={<P><ViewProblems /></P>} />
          <Route path="/profile" element={<P><Profile /></P>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
