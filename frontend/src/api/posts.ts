import {api} from './client'
import type {Post, Comment} from '../types'


export const getPosts = (authorId?: number) =>
    api.get<Post[]>(`/posts${authorId ? `?authorId=${authorId}` : ''}`)

export const getPostById = (id: number) => 
    api.get<Post & {comments: Comment[]}>(`/posts/${id}`)

export const createPost = (data: {title: string, description?: string, imageUrl?: string}) =>
    api.post<Post>('/posts', data)

export const updatePost = (id: number, data: {title?: string, description?: string, imageUrl?: string}) =>
    api.put<Post>(`/posts/${id}`, data)

export const deletePost = (id: number) => api.delete(`/posts/${id}`)

export const upvotePost = (id: number) => api.post<{message:string; pointsDelta:number}>(`/posts/${id}/upvote`)

export const downvotePost = (id: number) => api.post<{message:string; pointsDelta:number}>(`/posts/${id}/downvote`)