import { Link } from 'react-router-dom';
import { ButtonSmall } from './ButtonSmall';
import { ButtonSubmit } from './ButtonSubmit';

interface VoteActionsProps {
  onUpvote: () => void;
  onDownvote: () => void;
  points: number;
  canModify?: boolean;
  editUrl?: string;
  onDelete?: () => void;
}

export const VoteActions = ({
  onUpvote,
  onDownvote,
  points,
  canModify = false,
  editUrl,
  onDelete,
}: VoteActionsProps) => {
  return (
    <div className="flex flex-row items-center">
      <ButtonSmall onClick={onUpvote}>
        +
      </ButtonSmall>
      <ButtonSmall variant="disabled">
        {points}
      </ButtonSmall>
      <ButtonSmall onClick={onDownvote}>
        -
      </ButtonSmall>

      {canModify && (
        <div className="flex gap-3 ml-auto">
          {editUrl && (
            <Link to={editUrl}>
              <ButtonSubmit>Редактировать</ButtonSubmit>
            </Link>
          )}
          {onDelete && <ButtonSubmit onClick={onDelete}>Удалить</ButtonSubmit>}
        </div>
      )}
    </div>
  );
};