import {api} from './client'
import type {Comment} from '../types'

export const createComment = (data: {text: string, postId: number}) =>
    api.post<Comment>('/comments', data)

export const deleteComment = (id: number) => api.delete(`/comments/${id}`)

export const upvoteComment = (id: number) => api.post(`/comments/${id}/upvote`)

export const downvoteComment = (id: number) => api.post(`/comments/${id}/downvote`)