import { Link, useNavigate } from 'react-router-dom';
import { ButtonSubmit } from './ButtonSubmit';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth()
  
  return (
    <nav className="sticky top-0 z-50 mb-12 border-b-2 border-black bg-white font-mono">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/"
          className="text-2xl font-black text-black hover:bg-accent px-2 -ml-2 transition-colors"
        >
          Neoblog
        </Link>

        <div className="flex items-center gap-3">
            <ButtonSubmit onClick={() => navigate('/create')} className='max-w-25 flex-row gap-2.5' variant='accent'>
                <img src='/icons/add.svg' />
                <p>Создать</p>
            </ButtonSubmit>
            <ButtonSubmit onClick={() => navigate(`/users/${user?.id}`)} className='max-w-25 overflow-hidden' variant='accent'>
                <p>{user?.username}</p>
            </ButtonSubmit>
        </div>
      </div>    
    </nav>
  );
};