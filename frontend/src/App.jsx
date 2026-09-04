import {useContext} from 'react'
import { Routes, Route,Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import CreateNotePage from './pages/CreateNotePage'
import NotesDetailPage from './pages/NotesDetailPage'
import { AuthContext } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


function ProtectedRoute({ children }) {
  const { token} = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

const App = () => {
  
  return (
    <div >
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
 
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
        <Route path="/create" element={<ProtectedRoute><CreateNotePage /> </ProtectedRoute>} />
        <Route path="/notes/:id" element={<ProtectedRoute><NotesDetailPage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
