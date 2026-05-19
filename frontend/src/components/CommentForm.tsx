import { type SubmitEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createComment } from '../api/comments';
import { useApiCall } from '../hooks/useApiCall';
import { TextArea } from './TextArea';
import { useState } from 'react';

interface CommentFormProps {
  postId: number;
  onCommentPosted: () => void;
}

export const CommentForm = ({ postId, onCommentPosted }: CommentFormProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError('');
    try {
      await createComment({ text: text.trim(), postId });
      setText('');
      onCommentPosted();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не удалось опубликовать комментарий');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-6">
      <TextArea
        id="comment-textarea"
        rows={3}
        placeholder="Напишите комментарий..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        label="Комментарий"
        error={error}
        required
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="mt-2 border-3 border-black bg-accent px-4 py-2 font-bold text-sm shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#1A1A1A] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Отправить
      </button>
    </form>
  );
};