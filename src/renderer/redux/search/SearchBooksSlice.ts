import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CheckboxValueType } from "antd/es/checkbox/Group";
export interface searchedBooks {
  books: CheckboxValueType[];
  sidebarOpen: boolean;
  compilationsBookActive: boolean;
}

const initialState: searchedBooks = {
  books: [],
  sidebarOpen: false,
  compilationsBookActive: false,
}

export const SearchedBooksSlice = createSlice({
  name: 'searchedBooks',
  initialState,
  reducers: {
    storeSearchedBooks: (state, action: PayloadAction<CheckboxValueType[]>) => {
      state.books = action.payload
    },
sidebarChange: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    
}
  },
})

// Action creators are generated for each case reducer function
export const { storeSearchedBooks,sidebarChange } = SearchedBooksSlice.actions

export default SearchedBooksSlice.reducer