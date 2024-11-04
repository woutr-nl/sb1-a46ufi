export interface User {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  isAdmin?: boolean;
}