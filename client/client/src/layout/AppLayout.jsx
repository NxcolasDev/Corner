import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 w-full min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;