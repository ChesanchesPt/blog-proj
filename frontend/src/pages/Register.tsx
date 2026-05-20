import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '../components/TextField';
import { ButtonSubmit } from '../components/ButtonSubmit';
import { ErrorMessage } from '../components/ErrorMessage';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('')
    setLoading(true)
    
    try {
      await register(username, password);
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Ошибка входа. Пожалуйста, попробуйте снова'
      setError(message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-screen items-center justify-center'>
      <h1 className='text-5xl font-bold mb-8'>Добро пожаловать!</h1>
      <form onSubmit={handleSubmit}>
        <TextField className='mb-4' label='Ваш Логин' onChange={(e) => setUsername(e.target.value)}/>
        <TextField className='mb-4' label='Ваш пароль' type='password' onChange={(e) => setPassword(e.target.value)}/>
        
        <ButtonSubmit className='mb-4' type='submit' loading={loading}>
            Зарегистрироваться
          </ButtonSubmit>

        <p className='text-sm underline text-center'>Есть аккаунт?</p>
        <Link to="/login" className='text-sm font-bold block text-center text-accent'>Войти</Link>
        
        {error && (<ErrorMessage message={error} />)}
      </form>
    </div>
  );
};