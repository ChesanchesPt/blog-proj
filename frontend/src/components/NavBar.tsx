import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonSubmit } from './ButtonSubmit';
import { TextField } from './TextField';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth()
  
  const handleSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 mb-12 border-b-2 border-neo-black bg-white font-mono">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4 flex-wrap">
        <Link
          to="/"
          className="text-2xl font-black text-neo-black hover:bg-accent px-2 -ml-2 transition-colors"
        >
          Neoblog
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center flex-1 max-w-md mx-4"
        >
            <TextField label='' 
                type="search"
                placeholder="Поиск постов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-100 border-3 border-neo-black px-3 py-2 text-sm font-medium 
                  bg-white outline-none focus:ring-2 focus:ring-accent transition-shadow 
                  hover:shadow-[1px_1px_0px_#1A1A1A]`}
            />
        </form>

        <div className="flex items-center gap-3">
            <ButtonSubmit onClick={() => navigate('/create')} className='max-w-25 flex-row gap-2.5' variant='accent'>
                <img src='/icons/add.svg' />
                <p>Создать</p>
            </ButtonSubmit>
            <ButtonSubmit onClick={() => navigate(`/users/${user.id}`)} className='max-w-25 overflow-hidden' variant='accent'>
                <p>{user?.username}</p>
            </ButtonSubmit>
        </div>
      </div>    
    </nav>
  );
};