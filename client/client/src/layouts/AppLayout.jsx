import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(20);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const syncGoal = () => {
      const storedGoal = Number(localStorage.getItem("corner-daily-goal"));
      setDailyGoal(storedGoal > 0 ? storedGoal : 20);
    };

    syncGoal();
    window.addEventListener("cornerSettingsChanged", syncGoal);
    return () => window.removeEventListener("cornerSettingsChanged", syncGoal);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-6 px-4 py-4 md:flex-row md:px-6 md:py-6">
        <Sidebar navItems={navItems} user={user} onLogout={handleLogout} dailyGoal={dailyGoal} />

        <main className="app-main relative flex-1 pb-24 md:pb-0">
          <Header user={user} />

          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-300/60 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-sm items-center justify-between gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-2.5 text-center text-xs font-semibold ${
                  isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;