import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
 
const Sidebar = ({ navItems = [], user = {}, onLogout = () => {}, compact = false, dailyGoal = 20 }) => {
  const [storedGoal, setStoredGoal] = useState(dailyGoal);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    const savedGoal = Number(localStorage.getItem('corner-daily-goal'));
    setStoredGoal(savedGoal > 0 ? savedGoal : dailyGoal);
    const savedReminders = localStorage.getItem('corner-study-reminders');
    setRemindersEnabled(savedReminders !== 'false');
  }, [dailyGoal]);

  return (
    <aside className={`${compact ? 'w-20' : 'w-72'} sticky top-6 hidden shrink-0 flex-col rounded-[2rem] bg-slate-950/95 p-5 text-white shadow-2xl shadow-slate-900/10 md:flex md:max-h-[calc(100vh-3rem)] md:overflow-y-auto`}>
      <div className="mb-8 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} grid place-items-center rounded-3xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-slate-950/20`}>
            {logo ? <img src={logo} alt="Corner" className="h-8 w-8 object-contain" /> : 'C'}
          </div>
          {!compact && (
            <div>
              <p className="text-lg font-bold tracking-[0.02em] text-white">Corner</p>
              <p className="text-[0.72rem] uppercase tracking-[0.32em] text-slate-300">Flashcard Studio</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition duration-200 ${isActive ? 'bg-slate-700 text-white shadow-lg shadow-slate-950/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <item.icon size={18} />
            {!compact && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!compact && (
        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-4 text-slate-200">
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-slate-400">Daily focus</p>
          <p className="mt-3 text-3xl font-black text-white">{storedGoal}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">cards / day</p>
          <div className="mt-4 rounded-2xl bg-slate-900/70 p-3 text-xs uppercase tracking-[0.24em] text-slate-300">
            {remindersEnabled ? 'Reminders enabled' : 'Reminders off'}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800/40">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400" style={{ width: `${Math.min((storedGoal / 50) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[2rem] bg-white/5 p-4 ring-1 ring-white/10">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Signed in as</p>
        <p className="mt-2 truncate text-sm font-semibold text-white">{user?.username || 'Guest'}</p>
        <button onClick={onLogout} className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/20">
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
