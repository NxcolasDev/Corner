import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";

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

  return <DashboardLayout navItems={navItems} user={user} onLogout={handleLogout} dailyGoal={dailyGoal} />;
};

export default AppLayout;
