import { Outlet } from "react-router-dom";
import {
  CornerLayout,
  CornerSidebar,
  CornerSurface,
  CornerAvatar,
  CornerSectionTitle,
  CornerContentContainer,
} from "../corner";

const DashboardLayout = ({ navItems, user, onLogout, dailyGoal }) => {
  return (
    <CornerLayout>
      <div className="flex min-h-screen w-full gap-5">
        <CornerSidebar navItems={navItems} user={user} onLogout={onLogout} dailyGoal={dailyGoal} />

        <main className="min-w-0 flex-1 pb-8">
          <CornerSurface className="mb-5 border border-slate-200/80 p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CornerSectionTitle title={`Welcome back, ${user?.username || "Learner"}`} subtitle="Dashboard" />

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-slate-400">Today's goal</p>
                  <p className="mt-1 text-base font-bold text-slate-950">{dailyGoal} cards</p>
                </div>
                <CornerAvatar alt={user?.username || "G"} className="h-10 w-10 rounded-full text-sm" />
              </div>
            </div>
          </CornerSurface>

          <CornerContentContainer className="rounded-none bg-transparent p-0 shadow-none">
            <Outlet />
          </CornerContentContainer>
        </main>
      </div>
    </CornerLayout>
  );
};

export default DashboardLayout;
