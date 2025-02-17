import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PUBLIC_BASE_URL } from '../store';
// let envVariablesValue: any = null; 

// const envVariablesPromise = new Promise(resolve => {
//   window.electron.ipcRenderer.on('env-variables', (event, arg) => {
//     console.log("envibookdata variabless=======", event);
//     if (event !== null) {
//       envVariablesValue = event;
//       resolve(event);
//       return envVariablesValue
//     }
//   });
// });

// export const getEnvVariablesValue = () =>   envVariablesPromise;

// async function fetchBaseUrl() {
//   try {
//     const baseUrl = await updateBookReadCount();
//     console.log("Value of baseUrl outside function:", baseUrl);
//     return baseUrl;
//   } catch (error) {
//     console.error('Error updating book read count:', error);
//     throw error; 
//   }
// }

// fetchBaseUrl().then((baseUrl) => {
  
//   console.log("Stored value:", baseUrl);

// });

//  export const booksDataApi = createApi({
//   reducerPath: 'booksDataApi',
//   baseQuery: async (arg, api, extraOptions) => {
//     const baseUrl = await getEnvVariablesValue();
//     if (typeof baseUrl === 'string') {
//       return fetchBaseQuery({ baseUrl })(arg, api, extraOptions);
//     } else {
//       throw new Error('Base URL is not available.');
//     }
//   },
//   endpoints: (builder) => ({
//     getAllBooksData: builder.query<any, string>({
//       query: (language) => `api/book?bookLanguage=${language}`,
//     }),
//     getCompilationsBook: builder.query<any, string>({
//       query: (language) => `api/ebook?bookLanguage=${language}`,
//     }),
//   }),
// });

export const booksDataApi = createApi({
  reducerPath: 'booksDataApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api-dev.lucistrust.org' }),
  endpoints: (builder) => ({
    getAllBooksData: builder.query< any ,string>({
      query: (language) => `api/book?bookLanguage=${language}`,
    }),
    getCompilationsBook: builder.query< any ,string>({
      query: (language) => `api/ebook?bookLanguage=${language}`,
    }),
  }),
})

export const { useGetAllBooksDataQuery, useGetCompilationsBookQuery } = booksDataApi;
