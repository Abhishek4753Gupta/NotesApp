import React from 'react'
import Navbar from '../Components/NavBar'
import {useState,useEffect} from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import api from '../lib/axios'
import RateLimitedUI from '../Components/RateLimitedUI'
import NoteCard from '../Components/NoteCard'
import NotesNotFound from '../Components/NotesNotFound'
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    try{
      setLoading(true);
      const fetchNotes = async () => {
        const response = await api.get('/notes');
        setNotes(response.data);
      };
    }catch(error){
      console.error('Error fetching notes:', error);
      if(error.response && error.response.status === 429){
        setIsRateLimited(true);
      }else{
        toast.error('Error fetching notes');
      }
    }finally{
      setLoading(false);
    }
  },[]);
  return (
    <div className="min-h-screen ">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
