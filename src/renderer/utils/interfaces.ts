export interface BookInterface {
    authorName?: string;
    bookAddition?: string;
    bookLanguage?: string;
    bookLink?: string;
    bookName?: string;
    bookVersion?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string
    id?:number;
    bookPage?: number;
    bookDescription?: string;
    thumbnailLink?: string;
  }
  
  export interface searchResult {
    cfi: string;
    excerpt: string;
  }
  
  export interface navigableSearchResult extends searchResult {
    chapterHref: string;
  }
  export interface locationsFound {
    chapterName: string;
    chapterResults: searchResult[];
    chapterNumber: number;
    chapterHref: string;
  }
  
  
  export interface chapterData {
    href: string;
    title: string;
    subChapters?: chapterData[] | [];
  }
  
  export interface bookInfo {
    book: string;
      chapter: string;
  }
  
  export interface bookReadCounts{
    [bookName: string]: boolean;
  }