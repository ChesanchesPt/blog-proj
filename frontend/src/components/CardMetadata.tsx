import { Link } from 'react-router-dom'
import { formatRelativeDate } from '../utils/dates'

interface CardMetadataProps {
  authorId: number
  authorUsername: string
  createdAt: string
  linkPrefix?: string
}

export const CardMetadata = ({
  authorId,
  authorUsername,
  createdAt,
  linkPrefix = '/users'
}: CardMetadataProps) => (
  <div className="flex flex-wrap gap-x-4 mb-2.5 items-center text-[14px] font-medium text-black">
    <span>
      Автор:{' '}
      <Link
        to={`${linkPrefix}/${authorId}`}
        className="font-bold underline hover:bg-accent"
      >
        {authorUsername}
      </Link>
    </span>
    <span>{formatRelativeDate(createdAt)}</span>
  </div>
)
