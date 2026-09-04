import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { token,setToken} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("notesToken");
    setToken(null);
    navigate("/login");
  }
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">ThinkBoard</h1>
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
};
export default Navbar;
