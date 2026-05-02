import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '../components/TextField';
import { ButtonSubmit } from '../components/ButtonSubmit';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('')
    setLoading(true)

    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Ошибка входа. Пожалуйста, попробуйте снова'
      setError(message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      <h1 className='text-5xl font-bold mb-8'>С возвращением!</h1>
      <form onSubmit={handleSubmit}>
        <TextField label='Ваш Логин' onChange={(e) => setUsername(e.target.value)}/>
        <TextField label='Ваш пароль' type='password' onChange={(e) => setPassword(e.target.value)}/>

        <ButtonSubmit type='submit' loading={loading}>
          Войти
        </ButtonSubmit>

        <p className='text-sm underline text-center'>Нет аккаунта?</p>
        <Link to="/register" className='text-sm font-bold block text-center text-accent'>Зарегистрироваться</Link>

        {error && (
          <p role="alert" style={{ color: 'red' }} className='text-center'>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};