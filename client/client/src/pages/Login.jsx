import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/auth.service";
import logo from "../assets/logo/corner-logo.png";
import studyIllustration from "../assets/illustrations/study.png";
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
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100 relative">
      
      {/* Marca / Corner Logo no Canto Superior Esquerdo com efeito de iluminação */}
      <div className="absolute top-6 left-6 z-30 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
        <div className="relative grid place-items-center">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xs opacity-75 animate-pulse" />
          <img src={logo} alt="Corner Logo" className="relative h-7 w-auto object-contain" />
        </div>
        <span className="font-black tracking-wider text-sm bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          CORNER
        </span>
      </div>

      {/* Lado Esquerdo - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 pt-24 lg:pt-12 z-20">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">Bem-vindo de volta!</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Acesse sua conta para continuar suas sessões de repetição espaçada.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                  className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-900/90 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                  className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-900/90 border border-slate-800 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar na Conta"} <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="text-blue-400 font-bold hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Direito - Ilustração */}
      <div className="hidden lg:flex relative bg-slate-900 items-center justify-center p-12 overflow-hidden border-l border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <img src={studyIllustration} alt="Estudo" className="w-80 mx-auto object-contain drop-shadow-2xl" />
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              <Sparkles size={14} /> Repetição Espaçada
            </span>
            <h3 className="text-2xl font-black text-white">Aprenda mais rápido e retenha por mais tempo.</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize seus estudos em baralhos inteligentes e acompanhe suas metas diárias sem esforço.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;