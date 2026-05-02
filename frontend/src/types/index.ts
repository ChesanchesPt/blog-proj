export interface User {
    id: number,
    username: string,
    isAdmin: boolean,
    createdAt: string,
}

export interface Post {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    points: number,
    authorId: number,
    author: User,
    createdAt: string,
    updatedAt: string,
    comments: Comment[],
}

export interface Comment {
    id: number,
    text: string,
    points: number,
    authorId: number,
    author: User,
    postId: number,
    createdAt: string,
    updatedAt: string,
}