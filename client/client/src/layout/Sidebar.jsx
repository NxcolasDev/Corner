import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  BarChart3,
  StickyNote,
  Settings,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const primaryNav = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Baralhos", path: "/decks", icon: Layers },
    { name: "Estudar", path: "/study", icon: GraduationCap },
  ];

  const secondaryNav = [
    { name: "Estatísticas", path: "/statistics", icon: BarChart3 },
    { name: "Anotações", path: "/notes", icon: StickyNote },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800/60 p-5 select-none shrink-0 z-20 overflow-y-auto">
      {/* Brand & Logo */}
      <div className="space-y-7">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight block leading-none">
              Corner
            </span>
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase mt-1 block">
              STUDY APP
            </span>
          </div>
        </div>

        {/* Links Principais */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Principal
          </p>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon size={19} className={active ? "text-white" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ferramentas */}
      <div className="my-auto py-6 border-t border-slate-800/60 space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
          Ferramentas
        </p>
        {secondaryNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <Icon size={19} className={active ? "text-white" : "text-slate-400"} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Perfil & Sair */}
      <div className="pt-3 border-t border-slate-800/60 space-y-3">
        {user && (
          <div className="px-3 py-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30 overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name || "Usuário"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email || ""}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
        >
          <LogOut size={19} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;