import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { registerUser } from "../services/auth.service";
import logo from "../assets/logo/corner-logo.png";
import { ArrowRight, Sparkles, Lock, Mail, UserRound } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await registerUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%)]" />

      <div className="absolute left-6 top-6 z-30 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <div className="relative grid place-items-center">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-[6px] opacity-75" />
          <img src={logo} alt="Corner Logo" className="relative h-7 w-auto object-contain" />
        </div>
        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-sm font-black tracking-wider text-transparent">
          CORNER
        </span>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl md:p-8">
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400">
                <Sparkles size={14} /> Novo no Corner
              </span>
              <h1 className="text-3xl font-black tracking-tight text-white">Crie uma conta</h1>
              <p className="text-sm text-slate-400">
                Comece a organizar seus decks e revisar com mais foco.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Nome de usuário
                </label>
                <div className="relative mt-1.5">
                  <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  E-mail
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Senha
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Criando..." : "Registrar"} <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-center text-xs font-medium text-slate-500">
              Já tem conta?{" "}
              <Link className="font-bold text-blue-400 hover:underline" to="/">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
