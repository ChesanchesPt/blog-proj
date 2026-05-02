import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'register failed');
    }
  };

  return (
    <div>
      <h1>Добро пожаловать!</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Ваш Логин" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Ваш пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Регистрация</button>
        <p>Есть аккаунт?</p>
        <a href="/login">Войти</a>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};