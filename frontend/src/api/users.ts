import { api } from './client';
import { type User } from '../types';

export const getUserById = (id: number) => api.get<User>(`/users/${id}`);