import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/auth.service";
import logo from "../assets/logo/corner-logo.png";
import studyIllustration from "../assets/illustrations/study.png";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[.85fr_1.15fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0b1d3a] p-10 text-white lg:flex">
          <div><div className="flex items-center gap-3 text-2xl font-bold"><img src={logo} alt="Corner" className="h-9 w-9" />Corner</div><p className="mt-10 text-lg font-medium">Study smarter, not harder</p></div>
          <div className="rounded-xl bg-white/10 p-5 ring-1 ring-white/10"><p className="text-sm font-semibold">Your learning journey starts here.</p><img src={studyIllustration} alt="Student studying" className="mx-auto mt-4 max-h-56 object-contain" /></div>
        </aside>
        <div className="grid place-items-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2 text-xl font-bold text-slate-900"><img src={logo} alt="Corner" className="h-8 w-8" />Corner</div>
          <h1 className="text-xl font-bold text-slate-950">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue your learning.</p>
        </div>

        {error && <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Novo no Corner?{' '}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/register">
            Crie sua conta
          </Link>
        </p>
        </div></div></div>
    </div>
  );
};

export default Login;
