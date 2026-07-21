import CornerCard from "./CornerCard";
import CornerButton from "./CornerButton";

const CornerHeroSection = ({ user, streak, dueToday, onStart }) => {
  return (
    <CornerCard className="border-slate-200/80 bg-gradient-to-r from-white to-blue-50/60 p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-blue-500" />
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-blue-500">Study summary</p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Good morning, {user?.username || "Learner"} <span aria-hidden="true">👋</span></h1>
          <p className="text-sm text-slate-500">Keep going, consistency is the key.</p>
          <div className="flex flex-wrap items-center gap-3">
            <CornerButton onClick={onStart} className="rounded-lg px-4 py-2 text-xs">Continue review</CornerButton>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
              <span className="text-slate-400">Current streak: </span><span className="font-bold text-slate-900">{streak} days</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[0.58rem] uppercase tracking-[0.18em] text-slate-400">Due today</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{dueToday}</p>
            <p className="text-xs text-slate-500">cards waiting</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <p className="text-[0.58rem] uppercase tracking-[0.18em] text-slate-400">Goal</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{Math.max(dueToday, streak)}</p>
            <p className="text-xs text-slate-500">focus for the day</p>
          </div>
        </div>
      </div>
    </CornerCard>
  );
};

export default CornerHeroSection;
