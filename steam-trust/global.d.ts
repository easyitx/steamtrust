type Locale = Promise<{
    locale: string;
}>;

interface PaginationReq {
    page: number;
    limit?: number;
}

interface PaginationResponse<T> {
    hasNextPage: boolean
    hasPreviousPage: boolean
    items: T[]
    limit: number
    page: number
    pageCount: number
    total: number
}
