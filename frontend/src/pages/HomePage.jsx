
import Navbar from '../Components/NavBar'
import {useState,useEffect} from 'react'
import toast from 'react-hot-toast'

import api from '../lib/axios'
import RateLimitedUI from '../Components/RateLimitedUI'
import NoteCard from '../Components/NoteCard'
import NotesNotFound from '../Components/NotesNotFound'
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const handleSearch = (term) => {
    setSearch(term);
    setPage(1);
  }

  useEffect(() => {
  const fetchNotes = async () => {
    try {
      setLoading(true);
 
      const res = await api.get("/notes", {
          params: { page, limit: 3, search },
        });

      setNotes(res.data.notes);
      setTotalPages(res.data.totalPages);
      setIsRateLimited(false);

    } catch (error) {
      console.log("Error fetching notes");

      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchNotes();
}, [page,search]);

  return (
    <div className="min-h-screen ">
      <Navbar onSearch={handleSearch}/>
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          //   {notes.map((note) => (
          //     <NoteCard key={note._id} note={note} setNotes={setNotes} />
          //   ))}
          // </div>
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    setNotes={setNotes}
                  />
                ))}
              </div>

              <div className="flex flex-wrap justify-center items-center gap-3 mt-8 px-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="px-3 sm:px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="whitespace-nowrap">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-3 sm:px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
        )}
      </div>
    </div>
  )
}

export default HomePage
