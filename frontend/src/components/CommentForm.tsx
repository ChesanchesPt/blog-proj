import { type SubmitEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createComment } from '../api/comments';
import type { Comment } from '../types';
import { TextArea } from './TextArea';
import { useState } from 'react';
import { ButtonSubmit } from './ButtonSubmit';

interface CommentFormProps {
  postId: number;
  onCommentPosted: (comment: Comment) => void;
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
      const response = await createComment({ text: text.trim(), postId });
      setText('');
      onCommentPosted(response.data);
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
      <ButtonSubmit disabled={!text.trim()} className="mt-2">
        Отправить
      </ButtonSubmit>
    </form>
  );
};