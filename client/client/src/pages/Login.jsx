import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/auth.service";
import logo from "../assets/logo/corner-logo.png";
import { ArrowRight, Sparkles, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.");
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
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-400">
                <Sparkles size={14} /> Repetição Espaçada
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white">Bem-vindo de volta!</h2>
              <p className="text-sm text-slate-400">
                Acesse sua conta para continuar suas sessões de estudo com foco e consistência.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  E-mail
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar na Conta"} <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-center text-xs font-medium text-slate-500">
              Ainda não tem uma conta?{" "}
              <Link to="/register" className="font-bold text-blue-400 hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;