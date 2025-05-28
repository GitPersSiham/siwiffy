import React, { useState } from 'react';
import { useCreateUser } from '@/hooks/useCreateUser';

import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const { mutateAsync: createUsers, isPending } = useCreateUser();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    try {
      await createUsers(formData);
      setSuccess('Inscription réussie !');
      navigate('/login');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { field, message } = error.response.data;
        if (field && message) {
          setErrors({ [field]: message });
        } else {
          setErrors({ global: 'Erreur inconnue.' });
        }
      } else {
        setErrors({ global: 'Erreur réseau ou serveur.' });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">S'enregister</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-1 font-medium text-gray-700">Nom :</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <label className="block mb-1 font-medium text-gray-700">
            Email :
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <label className="block mb-1 font-medium text-gray-700">
            Mot de passe :
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button
            type="submit"
            className="bg-teal-700 text-white w-full py-2 rounded hover:bg-teal-800 transition"
          >
            S'inscrire
          </button>

          {errors.global && <p className="error">{errors.global}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
}
