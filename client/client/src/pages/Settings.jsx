import { useState } from "react";
import { User, Bell, Target, LogOut, Save, CheckCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { updateUserSettings } from "../services/user.service";

export default function Settings() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    dailyGoal: user?.dailyGoal || 20,
    studyReminders: user?.studyReminders ?? true,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const updatedUser = await updateUserSettings({
        dailyGoal: form.dailyGoal,
        studyReminders: form.studyReminders,
      });

      setForm((prev) => ({
        ...prev,
        email: updatedUser.email,
        username: updatedUser.username,
        dailyGoal: updatedUser.dailyGoal,
        studyReminders: updatedUser.studyReminders,
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Não foi possível atualizar suas preferências.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8 lg:p-10">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <ShieldCheck className="text-blue-300" size={14} /> Configurações
            </div>
            <h1 className="text-3xl font-black tracking-tight">Preferências do seu perfil</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Gerencie sua rotina de estudo, lembretes e detalhes da conta em um único painel organizado.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-700">Perfil do Usuário</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">NOME DE USUÁRIO</label>
              <input
                type="text"
                value={form.username}
                disabled
                className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">E-MAIL</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Target size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-700">Preferências de Aprendizado</h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Meta Diária de Cards</label>
              <p className="mb-1.5 text-[11px] text-slate-400">
                Quantidade de cartões que você planeja revisar todos os dias.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={form.dailyGoal}
                  onChange={(e) => setForm({ ...form, dailyGoal: Number(e.target.value) })}
                  className="w-28 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                />
                <span className="text-xs font-medium text-slate-500">cards / dia</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50/80 p-3.5">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Lembretes de Estudo</p>
                  <p className="text-[11px] text-slate-400">Ativar notificações para manter a sequência (streak).</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.studyReminders}
                onChange={(e) => setForm({ ...form, studyReminders: e.target.checked })}
                className="h-5 w-5 cursor-pointer rounded accent-blue-600"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-1 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Save size={16} />
            Salvar Configurações
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle size={14} /> Salvo com sucesso!
            </span>
          )}
        </div>
      </form>

      <section className="flex flex-col justify-between gap-4 rounded-[28px] border border-rose-100 bg-rose-50/60 p-5 sm:flex-row sm:items-center md:p-6">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Sair da Conta</h3>
          <p className="mt-0.5 text-xs text-rose-600/80">
            Sua sessão será encerrada neste navegador. Seus dados continuam salvos com segurança.
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          <LogOut size={15} />
          Sair do App
        </button>
      </section>
    </div>
  );
}