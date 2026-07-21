import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ user = {} }) => {
  return (
    <header className="app-header mb-6 rounded-[2rem] border border-slate-200/60 bg-white px-5 py-5 shadow-sm shadow-slate-200/70 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-sky-600 to-violet-600 text-lg font-black text-white shadow-lg shadow-slate-200/30">
            {logo ? <img src={logo} alt="Corner logo" className="h-8 w-8 object-contain" /> : 'C'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Corner</p>
            <h1 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">Your Personal Learning Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white">{user?.username?.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.username || 'Guest'}</p>
            <p className="text-xs text-slate-500">Ready to study</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;