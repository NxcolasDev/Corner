import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ navItems, user, onLogout, dailyGoal }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Navegação Lateral */}
      <Sidebar 
        navItems={navItems} 
        user={user} 
        onLogout={onLogout} 
      />

      {/* Área Principal de Conteúdo */}
      <main className="flex min-w-0 flex-1 flex-col">
        <Header 
          user={user} 
          dailyGoal={dailyGoal} 
        />
        
        <div className="flex-1 p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;