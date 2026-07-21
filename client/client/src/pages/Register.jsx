import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/auth.service";

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
      setError(err?.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/40 md:px-10 md:py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 to-violet-500 text-3xl font-black text-white shadow-lg shadow-sky-200/30">C</div>
          <h1 className="text-3xl font-black text-slate-950">Crie uma conta</h1>
          <p className="mt-3 text-sm text-slate-500">Comece a organizar seus decks e revisar com mais foco.</p>
        </div>

        {error && <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-slate-700">
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

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
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300/30 transition hover:bg-slate-900 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Registrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
