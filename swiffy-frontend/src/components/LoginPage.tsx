import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginUser } from '@/hooks/useAuth';
import { LoginResponse } from '@/api/userApi';

interface LoginPageProps {
    onLoginSuccess: (data: LoginResponse) => void;
  }
  const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const { mutateAsync: loginUserMutation, isPending } = useLoginUser(
    (data: LoginResponse) => {
      console.log("Login réussi (callback):", data);
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        onLoginSuccess(data);
        const from = (location.state as any)?.from?.pathname || '/nouvelle-reservation';
        navigate(from);
        setLoginError(null);
      } else if (data?.message) {
        console.log("Message:", data.message);
        setLoginError(null);
      } else {
        setLoginError('Erreur de connexion inattendue.');
      }
    },
    (error: any) => {
      console.error("Erreur de connexion (callback):", error);
      setLoginError(error?.response?.data?.message || "Erreur de connexion.");
    }
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    if (!email || !password) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await loginUserMutation({ email, password });
    } catch (error) {
      // L'erreur est déjà gérée dans le callback onError
    }
  };
  return (
<div className="flex items-center justify-center min-h-screen">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-700">Email :</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Mot de passe :</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        className="bg-teal-700 text-white w-full py-2 rounded hover:bg-teal-800 transition"
      >
        Se connecter
      </button>
      <button
        type="button"
        className="bg-teal-700 text-white w-full py-2 rounded hover:bg-teal-800 transition"
        onClick={() => navigate('/register')}
      >
        S'enregistrer
      </button>
      {loginError && <p className="text-red-500 text-center">{loginError}</p>}
    </form>
  </div>
</div>

  );
};

export default LoginPage;
