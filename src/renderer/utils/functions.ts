
import { useGetAllBooksDataQuery, useGetCompilationsBookQuery } from "../redux/booksData/BooksData";

export const makeLocationsForProgress = async (book:any) => {
  if (book.locations.total === 0) {
    const data = await book.locations.generate(2000);
    return data;
  }
};
  
  export const getAllBookData = (compilation:boolean) =>{
    
    if(compilation){
      const { data: allCompilationResponse } = useGetCompilationsBookQuery("English");
      console.log("allcompliationres",allCompilationResponse)
      return allCompilationResponse
    }else{
      const { data: allBooksResponse } = useGetAllBooksDataQuery("English");
      return allBooksResponse
    }
}


export function processSearchValue(text: string) {
  const regex = /^['"](.*)['"]$/;
  const match = text.match(regex);

  if (match) {
    // If quotes are found, extract the value without quotes
    return match[1];
  } else {
    // If no quotes, add quotes around the search value
    return `${text}`;
  }
}

