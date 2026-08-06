export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface Overview {
    users: number;
    books: number;
    borrows: number;
    reservations: number;
    fines: number;
}

export interface PopularBook {
    _id: string;
    title: string;
    author?: string;
    isbn: string;
    borrowCount: number;
}

export interface ActiveMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    totalBorrowed: number;
}

export interface FineStat {
    _id: string;
    total: number;
}

export interface MonthlyBorrow {
    month: string;
    total: number;
}