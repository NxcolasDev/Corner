import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const getInitialDailyGoal = () => {
  const storedGoal = Number(localStorage.getItem("corner-daily-goal"));
  return storedGoal > 0 ? storedGoal : 20;
};

const getInitialRemindersEnabled = () =>
  localStorage.getItem("corner-study-reminders") !== "false";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(getInitialDailyGoal);
  const [remindersEnabled, setRemindersEnabled] = useState(getInitialRemindersEnabled);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const saveSettings = () => {
    localStorage.setItem("corner-daily-goal", String(dailyGoal));
    localStorage.setItem("corner-study-reminders", String(remindersEnabled));
    window.dispatchEvent(new Event("cornerSettingsChanged"));
    alert("Settings saved.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Settings</h2>
        <p className="mt-3 text-sm text-slate-500">Manage your account and session preferences.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 md:p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Username</p>
            <p className="mt-2 break-words text-xl font-bold text-slate-950">{user?.username}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Email</p>
            <p className="mt-2 break-words text-xl font-bold text-slate-950">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Daily goal</label>
              <input
                type="number"
                min={1}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <p className="mt-2 text-sm text-slate-500">Target number of cards to review each day.</p>
            </div>
            <div>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Study reminders
              </label>
              <p className="mt-2 text-sm text-slate-500">Enable reminders for regular study sessions.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Save settings
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Signing out will clear your saved login session from this browser.</p>
          <button
            onClick={handleSignOut}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Log out
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
