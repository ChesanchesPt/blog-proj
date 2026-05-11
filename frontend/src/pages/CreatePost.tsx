import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { Navbar } from '../components/NavBar';
import { TextField } from '../components/TextField';
import { ButtonSubmit } from '../components/ButtonSubmit'; 
import { ErrorMessage } from '../utils/loadingError';

export const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPost({ title, description, imageUrl: imageUrl || undefined });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не удалось создать пост');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 gap-6">
        <h1 className="text-4xl font-black text-neo-black mb-8">Создайте пост</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="border-3 border-neo-black shadow-[6px_6px_0px_#1A1A1A] bg-white p-6"
        >
          <TextField
            label="Заголовок *"
            placeholder="Введите заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-1"
          />

          <div className="flex flex-col gap-1 mb-4">
            <label
              htmlFor="create-description"
              className="text-sm font-bold text-neo-black"
            >
              Описание
            </label>
            <textarea
              id="create-description"
              placeholder="Напишите что-нибудь..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border-3 border-neo-black shadow-[4px_4px_0px_#1A1A1A] px-3 py-3 text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-neo-accent transition-shadow hover:shadow-[2px_2px_0px_#1A1A1A] resize-y"
            />
            <span className="text-xs text-gray-500 text-right">
              {description.length} символов
            </span>
          </div>

          <TextField
            label="Ссылка на изображение"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mb-6"
          />

          {imageUrl && (
            <div className="mb-6 border-3 border-neo-black p-2 bg-neo-bg">
              <p className="text-xs font-bold mb-2">Предпросмотр:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover border-2 border-neo-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  setError('Не удалось загрузить изображение по ссылке');
                }}
              />
            </div>
          )}

          <ButtonSubmit loading={loading} className="w-full mb-4">
            Опубликовать
          </ButtonSubmit>

          {error && (<ErrorMessage message={error} />)}
        </form>
      </div>
    </>
  );
};