import {api} from './clients'
import type {User} from '../types'


export const register = (username: string, password: string) =>
    api.post<{token: string; user: User}>('/auth/register', {username, password})

export const login = (username: string, password: string) =>
    api.post<{token: string; user: User}>('/auth/login', {username, password})