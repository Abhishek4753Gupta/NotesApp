import { Link , useNavigate} from "react-router";
import { PlusIcon,SearchIcon } from "lucide-react";
import {memo,useContext,useState,useEffect} from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../lib/axios.js";

const Navbar = memo(({onSearch}) => {
  const { token,setToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const term = input.trim();

    if (!token || !isFocused || !term) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/suggestions", { params: { q: term } });
        setSuggestions(res.data);
      } catch (error) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, isFocused, token]);

  const runSearch = (term) => {
    setIsFocused(false);
    setSuggestions([]);
    onSearch(term.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(input);
  };

  const handleLogout = () => {
    localStorage.removeItem("notesToken");
    setToken(null);
    navigate("/login", { replace: true });
  }
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">ThinkBoard</h1>

          {token && (
            <form onSubmit={handleSubmit} className="relative w-full md:w-auto md:flex-1 md:max-w-md order-last md:order-none">
              <div className="join w-full">
                <input
                  type="text"
                  value={input}
                  placeholder="Search notes by title..."
                  className="input input-bordered join-item w-full"
                  onChange={(e) => {
                    setInput(e.target.value);
                    setIsFocused(true);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <button type="submit" className="btn btn-primary join-item">
                  <SearchIcon className="size-5" />
                </button>
              </div>

              {isFocused && suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 z-50 bg-base-100 border border-base-content/10 rounded-box shadow-lg overflow-hidden">
                  {suggestions.map((title) => (
                    <li
                      key={title}
                      className="px-4 py-2 cursor-pointer hover:bg-base-200 truncate"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setInput(title);
                        runSearch(title);
                      }}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          )}

          {token ?
          <div className="flex items-center gap-4">
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-error">
              <span className="font-bold">Logout</span>
            </button>
          </div>
          :
          <div className="flex items-center gap-4">
            <Link to={"/login"} className="btn btn-primary"> 
              <span className="font-bold">Login</span>
            </Link>
          </div>
          }
        </div>
      </div>
    </header>
  );
});
export default Navbar;
