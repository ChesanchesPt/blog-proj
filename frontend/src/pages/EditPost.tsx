import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPostById, updatePost } from '../api/posts';
import { Navbar } from '../components/NavBar';
import { TextField } from '../components/TextField';
import { ButtonSubmit } from '../components/ButtonSubmit';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await getPostById(Number(id));
        const post = res.data;
        if (user?.id !== post.authorId && !user?.isAdmin) {
          navigate('/');
          return;
        }
        setTitle(post.title);
        setDescription(post.description || '');
        setImageUrl(post.imageUrl || '');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await updatePost(Number(id), { title, description, imageUrl: imageUrl || undefined });
      navigate(`/posts/${id}`);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to update post');
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (error) return <><Navbar /><div className="max-w-2xl mx-auto px-4 py-6"><ErrorMessage message={error} /></div></>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 gap-6">
        <h1 className="text-4xl font-black text-black mb-8">Редактировать пост</h1>

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
            className="mb-1"
          />

          <div className="flex flex-col gap-1 mb-4">
            <textarea
              placeholder="Напишите что-нибудь..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border-3 border-black shadow-[4px_4px_0px_#1A1A1A] px-3 py-3
              text-sm font-medium bg-white outline-none
              focus:ring-2 focus:ring-neo-accent
              transition-shadow hover:shadow-[2px_2px_0px_#1A1A1A] resize-y"
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
            <div className="mb-6 border-3 border-black p-2 bg-background">
              <p className="text-xs font-bold mb-2">Предпросмотр:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover border-2 border-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  setSubmitError('Не удалось загрузить изображение по ссылке');
                }}
              />
            </div>
          )}

          <div className="flex gap-3 mb-4">
            <ButtonSubmit className="flex-1">
              Сохранить изменения
            </ButtonSubmit>
            <ButtonSubmit variant="accent" onClick={() => navigate(`/posts/${id}`)} className="flex-1">
              Отмена
            </ButtonSubmit>
          </div>

          {submitError && (<ErrorMessage message={submitError} />)}
        </form>
      </div>
    </>
  );
};
