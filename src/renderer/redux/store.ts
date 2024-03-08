import { configureStore } from '@reduxjs/toolkit'
import SearchedBooksSlice  from './search/SearchBooksSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { booksDataApi } from './booksData/BooksData'
export const store = configureStore({
    reducer: {
        booksData: SearchedBooksSlice,
            [booksDataApi.reducerPath]: booksDataApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksDataApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
