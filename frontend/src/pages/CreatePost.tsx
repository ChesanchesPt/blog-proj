import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { Navbar } from '../components/NavBar';
import { TextField } from '../components/TextField';
import { TextArea } from '../components/TextArea';
import { ButtonSubmit } from '../components/ButtonSubmit';
import { ErrorMessage } from '../components/ErrorMessage';

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
        <h1 className="text-4xl font-black text-black mb-8">Создайте пост</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="border-3 border-black shadow-[6px_6px_0px_#1A1A1A] bg-white p-6"
        >
          <TextField
            label="Заголовок *"
            placeholder="Введите заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-4"
          />

          <TextArea
            label="Описание"
            placeholder="Напишите что-нибудь..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="mb-4"
          />
          <span className="text-xs text-gray-500 text-right block mb-4">
            {description.length} символов
          </span>

          <TextField
            label="Ссылка на изображение"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mb-6"
          />

          {imageUrl && (
            <div className="mb-6 border-3 border-black p-2 bg-background">
              <p className="text-xs font-bold mb-2">Предпросмотр:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover border-2 border-black"
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