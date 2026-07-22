import React from 'react'
import { Routes, Route } from 'react-router'
import HomePage from './pages/HomePage'
import CreateNotePage from './pages/CreateNotePage'
import NotesDetailPage from './pages/NotesDetailPage'
import toast from 'react-hot-toast'
const App = () => {
  return (
    <div data-theme="relative h-full w-full">
      {/* <button className="btn btn-outline" onClick={() => toast.success('This is a success message!')}>Show Success Toast</button> */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateNotePage />} />
        <Route path="/notes/:id" element={<NotesDetailPage />} />  
      </Routes>
    </div>
  )
}

export default App
