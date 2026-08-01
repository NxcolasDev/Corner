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
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#f6f9ff_48%,#eef4ff_100%)] text-slate-800 antialiased font-sans">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 min-w-0 overflow-y-auto bg-transparent">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;