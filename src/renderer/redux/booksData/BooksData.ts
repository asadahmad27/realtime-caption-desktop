// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PUBLIC_BASE_URL } from '../../utils/api'


// Define a service using a base URL and expected endpoints
export const booksDataApi = createApi({
  reducerPath: 'booksDataApi',
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_BASE_URL }),
  endpoints: (builder) => ({
    getAllBooksData: builder.query< any ,string>({
      query: (language) => `api/book?bookLanguage=${language}`,
    }),
    getCompilationsBook: builder.query< any ,string>({
      query: (language) => `api/ebook?bookLanguage=${language}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllBooksDataQuery, useGetCompilationsBookQuery } = booksDataApi