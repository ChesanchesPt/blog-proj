import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h1>С возвращением!</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Ваш Логин" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Ваш пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Войти</button>
        <p>Нет аккаунта?</p>
        <a href="/register">Зарегистрироваться</a>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};