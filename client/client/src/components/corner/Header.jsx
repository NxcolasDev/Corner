const Header = ({ user = {}, dailyGoal = 20 }) => {
  return (
    <header className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Lado Esquerdo: Título da Seção e Saudação */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-sky-600">
            Dashboard
          </p>
          <h1 className="mt-0.5 truncate text-xl font-black text-slate-950 sm:text-2xl">
            Welcome back, {user?.username || "Learner"}
          </h1>
        </div>

        {/* Lado Direito: Meta Diária + Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 text-slate-700">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-slate-400">
                Today's goal
              </p>
              <p className="mt-0.5 text-sm font-black text-slate-950">
                {dailyGoal} cards
              </p>
            </div>
          </div>

          <div 
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-sky-500/20"
            title={user?.username || "Guest"}
          >
            {user?.username?.slice(0, 1).toUpperCase() || "G"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;