import React, { useState } from "react";
import { User, Bell, Target, LogOut, Save, CheckCircle, ShieldCheck } from "lucide-react";

export default function Settings({ user, onSaveSettings, onLogout }) {
  const [form, setForm] = useState({
    username: user?.username || "nicolasjsilva622@gmail.com",
    email: user?.email || "nnasndand@gmail.com",
    dailyGoal: user?.dailyGoal || 20,
    notifications: user?.notifications ?? true,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSettings) onSaveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configurações</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">Gerencie suas preferências de estudo e conta.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloco 1: Perfil do Usuário */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Perfil do Usuário</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">NOME DE USUÁRIO</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="mt-1.5 w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">E-MAIL</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="mt-1.5 w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Preferências de Aprendizado */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Preferências de Aprendizado</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs font-semibold text-slate-600">Meta Diária de Cards</label>
              <p className="text-[11px] text-slate-400 mb-1.5">Quantidade de cartões que você planeja revisar todos os dias.</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={form.dailyGoal}
                  onChange={(e) => setForm({ ...form, dailyGoal: Number(e.target.value) })}
                  className="w-28 bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition font-bold"
                />
                <span className="text-xs text-slate-500 font-medium">cards / dia</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Lembretes de Estudo</p>
                  <p className="text-[11px] text-slate-400">Ativar notificações para manter a sequência (streak).</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.notifications}
                onChange={(e) => setForm({ ...form, notifications: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition"
          >
            <Save size={16} />
            Salvar Configurações
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle size={14} /> Salvo com sucesso!
            </span>
          )}
        </div>
      </form>

      {/* Sair da Conta / Danger Zone */}
      <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Sair da Conta</h3>
          <p className="text-xs text-rose-600/80 mt-0.5">Sua sessão será encerrada neste navegador. Seus dados continuam salvos com segurança.</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shrink-0"
        >
          <LogOut size={15} />
          Sair do App
        </button>
      </div>
    </div>
  );
}