import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { VscCircleFilled } from 'react-icons/vsc';
import { getAllBookData, processSearchValue } from '../../../utils/functions';
import {
  BookInterface,
  bookInfo,
  locationsFound,
  navigableSearchResult,
  searchResult,
} from '../../../utils/interfaces';
import {
  CrossIcon,
  SelectedBookIcon,
} from '../../../../../assets/iconsCustom/Svgs';
import './SearchedList.css';

interface SearchedListProps {
  searchResults: locationsFound[];
  setCfiToNavigateAndChapter: (cfi: string, chapter: string) => void;
  totalMatchFound: number;
  currentBookMatchedResults: number;
  currentBookName: string;
  parentRendition: any;
  selectedCfi: string;
  searching?: boolean;
  setCurrentBookAndChapter: React.Dispatch<React.SetStateAction<bookInfo>>;
  currentBookIndex: number;
  proceedNext: boolean;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
  cfiToNavigate: string;
  currentBookAndChapter: bookInfo;
}

const SearchedList: React.FC<SearchedListProps> = ({
  searchResults,
  setCfiToNavigateAndChapter,
  totalMatchFound,
  currentBookMatchedResults,
  currentBookName,
  parentRendition,
  selectedCfi,
  searching,
  setCurrentBookAndChapter,
  currentBookIndex,
  proceedNext,
  setProceedNext,
  cfiToNavigate,
  currentBookAndChapter,
}) => {
  const [currentResultNumber, setCurrentResultNumber] = useState<number>(0);
  const [navigableSearchResult, setNavigableSearchResult] = useState<
    navigableSearchResult[]
  >([]);
  const [selectedResult, setSelectedResult] = useState<navigableSearchResult>({
    cfi: '',
    chapterHref: '',
    excerpt: '',
  });
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const compilationActive = searchParams.get('compilation');
  const bookId = searchParams.get('bookId');
  const allBooksData = getAllBookData(compilationActive === 'true');
  let { searchText } = useParams();
  searchText = processSearchValue(searchText as string);
  const resultsListRef = useRef<HTMLDivElement | null>(null);
  const resultListParentRef = useRef<HTMLDivElement | null>(null);

  const searchBooks: CheckboxValueType[] = useSelector(
    (state: RootState) => state.booksData.books,
  );

  let currentBook: BookInterface = allBooksData?.data.find(
    (book: BookInterface) => book.bookName === currentBookName,
  );

  if (compilationActive === 'true') {
    currentBook = allBooksData?.data.find(
      (book: BookInterface) => book._id === bookId,
    );
  }

  useEffect(() => {
    let allSearchResults: navigableSearchResult[] = [];
    if (!parentRendition) return;
    searchResults.forEach((singleResult) => {
      let currentChapterResults: navigableSearchResult[] = [];
      singleResult.chapterResults?.forEach((singleChapterResult) => {
        const currentResult = {
          ...singleChapterResult,
          chapterHref: singleResult.chapterHref,
        };
        setTimeout(() => {
          parentRendition.annotations.remove(
            singleChapterResult.cfi,
            'underline',
          );
          parentRendition.annotations.underline(
            singleChapterResult.cfi,
            {},
            () => {
              // change color here
            },
            'matchedSearchText',
          );
        }, 100);
        currentChapterResults.push(currentResult);
      });
      allSearchResults.push(...currentChapterResults);
    });
    setNavigableSearchResult(allSearchResults);
  }, [searchResults, currentBookAndChapter?.chapter]);

  useEffect(() => {
    if (parentRendition) {
      setTimeout(() => {
        parentRendition.annotations.remove(cfiToNavigate, 'underline');
        parentRendition.annotations.underline(
          cfiToNavigate,
          {},
          () => {
            // change color here
          },
          'matchedSearchText',
        );
      }, 300);
    }
  }, [cfiToNavigate]);
  const navigateToSearch = (cfi: string, chapterKey: string) => {
    const bookResultNumber = navigableSearchResult.findIndex(
      (item) => item.cfi === cfi,
    );
    setCurrentResultNumber(bookResultNumber);
    setCfiToNavigateAndChapter(cfi, chapterKey);
  };
  const handleSearchResultNavigation = (
    searchNumber: number,
    next: boolean,
  ) => {
    setCurrentResultNumber(searchNumber);
    const { cfi, chapterHref } = navigableSearchResult[searchNumber];
    setSelectedResult(navigableSearchResult[searchNumber]);
    setCfiToNavigateAndChapter(cfi, chapterHref);
    if (resultsListRef.current && resultListParentRef.current) {
      const offsetTop = next
        ? resultsListRef.current.offsetTop - 210
        : resultsListRef.current.offsetTop - 350;

      resultListParentRef.current.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const navigate = useNavigate();
  const customStyle = {
    color: 'red', // Change this to the desired text color
  };

  const handleBookNavigation = (type: string) => {
    if (!proceedNext) return;
    setProceedNext(false);
    setCurrentBookAndChapter({
      book:
        type === 'back'
          ? (searchBooks[currentBookIndex - 1] as string)
          : (searchBooks[currentBookIndex + 1] as string),
      chapter: 'Text/cover.xhtml',
    });
    setCurrentResultNumber(0);
    setSelectedResult({
      cfi: '',
      chapterHref: '',
      excerpt: '',
    });
  };

  return (
    <>
      <div className="searchedList" ref={resultListParentRef}>
        <div className="stickyInfo">
          {searchResults?.length > 0 ? (
            <div
              className="bookNavCrossIcon"
              onClick={() => {
                if (selectedCfi.length) {
                  if (compilationActive === 'true') {
                    navigate(
                      `/book/${currentBook?._id}?cfi=${selectedCfi}&compilation=true&bookId=${bookId}`,
                    );
                  } else {
                    navigate(
                      `/book/${currentBook?._id}?cfi=${selectedCfi}&compilation=false&bookId=${currentBook?._id}`,
                    );
                  }
                }
              }}
            >
              <CrossIcon />
            </div>
          ) : (
            <div
              className="bookNavCrossIcon"
              onClick={() => {
                if (compilationActive === 'true') {
                  navigate(
                    `/book/${allBooksData?.data[0]._id}?compilation=true`,
                  );
                } else {
                  navigate(
                    `/book/${allBooksData?.data[0]._id}?compilation=false`,
                  );
                }
              }}
            >
              <CrossIcon />
            </div>
          )}

          <div className="searchTermContainer">
            <p className="searchTerm">
              {t('Search')}:{' '}
              <span className="searchTermText">
                {searchText && searchText?.length > 10 ? (
                  <Tooltip
                    placement="bottomLeft"
                    title={searchText}
                    color="#fff"
                    overlayStyle={customStyle}
                    showArrow
                  >
                    {searchText?.slice(0, 10) + '...'}
                  </Tooltip>
                ) : (
                  searchText
                )}
              </span>
            </p>
            <p className="resultsNumber">
              {t('Total Results')}: {totalMatchFound}
            </p>
          </div>
          <div>
            <p className="resultsNumber">
              {t('Current Book Result')}:{currentBookMatchedResults || 0}
            </p>
          </div>

          <div className="bookNameInfo">
            <button
              className={`navResultButtonPrev normalSvg ${
                (searchBooks?.length && currentBookIndex === 0) ||
                compilationActive === 'true'
                  ? 'disabledNav'
                  : ''
              } `}
              onClick={() =>
                searchBooks?.length &&
                currentBookIndex !== 0 &&
                handleBookNavigation('back')
              }
            >
              <FaAngleLeft />
            </button>

            <div className="bookInfo">
              {currentBookName ? (
                <>
                  <SelectedBookIcon />{' '}
                  <span className="bookName">{currentBookName}</span>
                </>
              ) : (
                t('No Book Opened with Results')
              )}
            </div>
            <button
              className={`navResultButtonPrev normalSvg ${
                (searchBooks?.length &&
                  currentBookIndex === searchBooks.length - 1) ||
                compilationActive === 'true'
                  ? 'disabledNav'
                  : ''
              } `}
              onClick={() =>
                searchBooks?.length &&
                currentBookIndex !== searchBooks.length - 1 &&
                handleBookNavigation('forward')
              }
            >
              <FaAngleRight />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="navResultBar">
              <button
                onClick={() =>
                  handleSearchResultNavigation(currentResultNumber - 1, false)
                }
                disabled={currentResultNumber === 0}
                className={`navResultButtonPrev ${
                  currentResultNumber === 0 ? 'disabledNav' : ''
                } `}
              >
                <span className="normalSvg">
                  <FaAngleLeft />
                </span>{' '}
                {t('Prev Result')}
              </button>
              <button
                onClick={() =>
                  handleSearchResultNavigation(currentResultNumber + 1, true)
                }
                disabled={
                  currentResultNumber === navigableSearchResult.length - 1
                }
                className={`navResultButtonNext ${
                  currentResultNumber === navigableSearchResult.length - 1
                    ? 'disabledNav'
                    : ''
                } `}
              >
                {t('Next Result')}{' '}
                <span className="normalSvg">
                  <FaAngleRight />
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="resultsList" key={searchResults.length}>
          {searchResults.length ? (
            searchResults.map((singleResult: locationsFound, index: number) => {
              const {
                chapterHref,
                chapterName,

                chapterResults,
              } = singleResult;

              return (
                <div className="resultContainer" key={index}>
                  <div className="result">
                    <span className="chapterNumber">{chapterName}</span>
                    {chapterResults?.map(
                      (singleResult: searchResult, k: number) => {
                        return (
                          <div key={k}>
                            <span
                              className={`singleResult ${
                                (singleResult.cfi.length &&
                                  selectedResult?.cfi === singleResult.cfi &&
                                  selectedResult?.chapterHref === chapterHref &&
                                  selectedResult?.excerpt ===
                                    singleResult.excerpt) ||
                                (!selectedResult?.cfi && k === 0 && index === 0)
                                  ? 'selectedResult'
                                  : ''
                              }`}
                              onClick={() => {
                                navigateToSearch(singleResult.cfi, chapterHref);
                                setSelectedResult({
                                  cfi: singleResult.cfi,
                                  chapterHref: chapterHref,
                                  excerpt: singleResult.excerpt,
                                });
                              }}
                              ref={
                                (singleResult.cfi.length &&
                                  selectedResult?.cfi === singleResult.cfi &&
                                  selectedResult?.chapterHref === chapterHref &&
                                  selectedResult?.excerpt ===
                                    singleResult.excerpt) ||
                                (!selectedResult?.cfi && k === 0 && index === 0)
                                  ? resultsListRef
                                  : null
                              }
                            >
                              <div className="resultArrow">
                                <VscCircleFilled
                                  style={{ width: '12px', height: '12px' }}
                                />
                              </div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: singleResult.excerpt,
                                }}
                              ></span>
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="noResultsFound">
              <p>
                {searchBooks?.length > 0
                  ? searching
                    ? t('Searching...')
                    : t('No Results Found')
                  : t('Please Search for Something')}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchedList;
