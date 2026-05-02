import {api} from './client'
import type {Comment} from '../types'


export const getCommentsByPost = (postId: number) => 
    api.get<Comment[]>(`/posts/${postId}/comments`)

export const createComment = (data: {text: string, postId: number}) =>
    api.post<Comment>('/comments', data)

export const updateComment = (id: number, data: {text?: string}) =>
    api.put<Comment>(`/comments/${id}`, data)

export const deleteComment = (id: number) => api.delete(`/comments/${id}`)

export const upvoteComment = (id: number) => api.post(`/comments/${id}/upvote`)

export const downvoteComment = (id: number) => api.post(`/comments/${id}/downvote`)