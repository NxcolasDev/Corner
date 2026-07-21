import logo from "../../assets/logo/corner-logo.png";

const Header = ({ user = {} }) => {
  return (
    <header className="mb-6 rounded-[2rem] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.08)] md:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[1.75rem] bg-slate-950 text-white shadow-lg shadow-slate-950/10">
            {logo ? <img src={logo} alt="Corner logo" className="h-7 w-7 object-contain" /> : "C"}
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Corner</p>
            <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">Your Personal Learning Hub</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
            {user?.username?.slice(0, 1).toUpperCase() || "G"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.username || "Guest"}</p>
            <p className="text-xs text-slate-500">Ready to study</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
