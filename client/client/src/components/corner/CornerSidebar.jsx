import { NavLink } from "react-router-dom";
import logo from "../../assets/logo/corner-logo.png";

const CornerSidebar = ({ navItems = [], user = {}, onLogout = () => {}, dailyGoal = 20 }) => {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-56 shrink-0 rounded-2xl bg-[#0b1d3a] p-4 text-white shadow-xl shadow-slate-900/10 md:flex md:flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 px-1">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-white">
            {logo ? <img src={logo} alt="Corner logo" className="h-8 w-8 object-contain" /> : "C"}
          </div>
          <div>
            <p className="text-base font-bold">Corner</p>
            <p className="text-[0.58rem] uppercase tracking-[0.2em] text-slate-400">Flashcard Studio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
            }
          >
            <item.icon size={17} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 grid gap-3 rounded-xl bg-white/7 p-4 ring-1 ring-white/10">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Daily goal</p>
          <p className="mt-2 text-2xl font-bold">{dailyGoal}</p>
          <p className="text-xs text-slate-300">cards to review today</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-3/4 bg-gradient-to-r from-sky-500 to-violet-500" />
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
        <p className="mt-1 truncate text-xs font-medium text-white">{user?.username || "Guest"}</p>
        <button onClick={onLogout} className="mt-3 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default CornerSidebar;
