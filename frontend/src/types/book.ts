export interface Author {
  _id: string;
  name: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Publisher {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Book {
  _id: string;
  title: string;
  isbn: string;
  description: string;
  language: string;
  publicationYear?: number;
  pages?: number;
  authors: Author[];
  publisher: Publisher;
  category: Category;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}