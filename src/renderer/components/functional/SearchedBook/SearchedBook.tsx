import React, { useEffect, useState, useRef } from 'react';
import ePub, { Book, Location, NavItem } from 'epubjs';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { BookOptions } from 'epubjs/types/book';
import { Button } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookInterface } from '../../../utils/interfaces';
import {
  getAllBookData,
  makeLocationsForProgress,
} from '../../../utils/functions';
import { MinusLogo, PlusLogo } from '../../../../../assets/iconsCustom/Svgs';
import './SearchedBook.css';

interface SearchedBookProps {
  cfiToNavigate: string;
  currentBookAndChapter: { book: string; chapter: string };
  parentRendition: any;
  setParentRendition: React.Dispatch<any>;
  setSelectedCfi: React.Dispatch<React.SetStateAction<string>>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
  proceedNext: boolean;
  firstResult: string;
  setFirstSearchResult: React.Dispatch<React.SetStateAction<string>>;
  navigateToOnlyCfi: boolean;
  setNavigateToOnlyCfi: React.Dispatch<React.SetStateAction<boolean>>;
}
const SearchedBook: React.FC<SearchedBookProps> = ({
  cfiToNavigate,
  currentBookAndChapter,
  parentRendition,
  setParentRendition,
  setSelectedKeys,
  setOpenKeys,
  setSelectedCfi,
  firstResult,
  setFirstSearchResult,
  setProceedNext,
  proceedNext,
  navigateToOnlyCfi,
  setNavigateToOnlyCfi,
}) => {
  const { t } = useTranslation();
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [Book, setBook] = useState<Book | null>(null);
  const [recentlyRenderedBook, setRecentlyRenderedBook] = useState<string>('');
  const [disableBackward, setDisableBackward] = useState(false);
  const [disableFroward, setDisableFroward] = useState(false);
  const [totalPages, setTotalPages] = useState<any>(0);
  const [singlePageMode, setSinglePageMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [currentCfi, setCurrentCfi] = useState<string>('');
  const [sameSectionOpened, setSameSectionOpened] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const compilationActive = searchParams.get('compilation');
  const allBooksData = getAllBookData(
    compilationActive === 'true' ? true : false,
  );
  const bookId = searchParams.get('bookId');
  useEffect(() => {
    if (
      currentBookAndChapter?.book.split('=>')[0] !== recentlyRenderedBook ||
      !recentlyRenderedBook
    ) {
      if (currentBookAndChapter?.book) {
        if (Book) Book.destroy();
        setRecentlyRenderedBook(currentBookAndChapter?.book.split('=>')[0]);

        renderBook();
      } else {
        renderBook(allBooksData?.data[0].bookLink);
      }
    } else {
      if (!navigateToOnlyCfi) {
        // this is to remove the jerk while navigating between search results
        parentRendition?.display(
          currentBookAndChapter?.chapter.split('___')[0] || 0,
        );
      } else {
        setNavigateToOnlyCfi(false);
      }
    }
    window.addEventListener('resize', handleBrowserResize);
    return () => {
      window.removeEventListener('resize', handleBrowserResize);
    };
  }, [currentBookAndChapter, allBooksData]);

  useEffect(() => {
    // Run this function after 300 milliseconds
    const timer = setTimeout(removeFirstChildIfMultiple, 700); // this is because epub mistakenly duplicates the book render view

    // Clean up the timer if the component unmounts or the dependency changes
    return () => clearTimeout(timer);
  }, [bookContainerRef.current]);

  useEffect(() => {
    try {
      if (cfiToNavigate && parentRendition) {
        parentRendition.display(cfiToNavigate);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  }, [cfiToNavigate]);
  const handleBrowserResize = () => {
    parentRendition?.resize();
    renderBook();
  };
  const removeFirstChildIfMultiple = () => {
    const container = bookContainerRef.current;
    if (container && container.children.length > 1) {
      while (container.children.length > 1) {
        container.removeChild(container.children[0]); // Remove the first child
      }
    }
  };
  const renderBook = async (bookLink?: string) => {
    let book: null | Book = null;
    if (bookLink) {
      book = ePub(bookLink);
    } else {
      book = ePub(currentBookAndChapter?.book.split('=>')[0] as BookOptions);
    }
    setBook(book);
    let rendition: any = null;

    rendition = book.renderTo('book-container', {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
    });
    setParentRendition(rendition);
    await book.ready;

    await makeLocationsForProgress(book);
    let modifiedToc: NavItem[] = [];

    await book.loaded.navigation.then(function (bookData: any) {
      modifiedToc = bookData?.toc?.slice();
    });

    modifiedToc.splice(1, 2); // Remove second and third items
    findTotalProgress(modifiedToc, rendition, book);
    rendition.display(
      firstResult?.length && firstResult !== 'empty'
        ? firstResult
        : currentBookAndChapter?.chapter.split('___')[0] || 0,
    );
    setFirstSearchResult((prev) => (prev.length > 0 ? 'empty' : ''));
  };

  const handleZoom = (zoomValue: number) => {
    if (parentRendition) {
      parentRendition.themes.default({
        p: { 'font-size': `${zoomValue + 16}px !important` },
      });

      currentCfi && parentRendition.display(currentCfi);
    }
  };

  const findTotalProgress = async (
    modifiedToc: NavItem[],
    rendition: any,
    book: any,
  ) => {
    try {
      rendition.on('relocated', function (locations: Location) {
        setCurrentCfi(locations.start.cfi);
        if (locations.start.displayed.page === locations.end.displayed.page) {
          setSinglePageMode(true);
          setTotalPages(locations.start.displayed.total);
          setCurrentPage(locations.start.displayed.page);
        } else {
          setSinglePageMode(false);
          setTotalPages({
            startPages: locations.start.displayed.total,
            endPages: locations.end.displayed.total,
          });
          setCurrentPage({
            startPage: locations.start.displayed.page,
            endPage: locations.end.displayed.page,
          });
          setSameSectionOpened(
            locations.start.displayed.total === locations.end.displayed.total
              ? true
              : false,
          );
        }

        setSelectedCfi(locations.start.cfi);
        let progress = book?.locations.percentageFromCfi(locations.start.cfi);
        progress = Math.round(progress * 100);
        const newChapter: NavItem = modifiedToc?.find(
          (item) => item.href === locations.start.href,
        ) as NavItem;

        let newChapterHref = newChapter.href;

        const chapterIndex = modifiedToc.length
          ? modifiedToc.findIndex(
              (chapter: any) => chapter.href === newChapterHref,
            )
          : 0;
        if (locations.start.displayed.page === 1 && chapterIndex === 0) {
          setDisableBackward(true);
        } else {
          setDisableBackward(false);
        }
        if (
          locations.start.displayed.page === locations.start.displayed.total &&
          chapterIndex === modifiedToc.length - 1
        ) {
          setDisableFroward(true);
        } else {
          setDisableFroward(false);
        }

        // TO HANDLE SIDE BAR SELECTION
        // to se the selected key for side bar
        let currentBookData: BookInterface = {};
        if (compilationActive === 'true') {
          currentBookData = allBooksData.data.find(
            (item: BookInterface) => item._id === bookId,
          ) as BookInterface;
        } else {
          currentBookData = allBooksData.data.find(
            (item: BookInterface) =>
              item.bookLink === currentBookAndChapter.book.split('=>')[0],
          ) as BookInterface;
        }

        let newBookUrl = '';
        let result = '';
        let hrefForSubChapter = '';
        let hrefForBook = '';

        if (newChapter.subitems?.length) {
          // this is to make the sub chapter parent or sub chapters appeared to be selected if someone clicks on them
          const matches = locations.end.cfi.match(/\[([^\]]+)\]/g); // Regex to match text between "[" and "]"

          result = matches && matches[1] ? matches[1] : ''; // Extracting the last matched string
          result = result?.substring(1);
          result = result?.slice(0, -1);

          newChapterHref = // this is to make the book which have sub chapters and the sub chapters parent appeared to be selected if someone clicks on them (selected) CASE 1 => CLICKED ON THE PARENT OF SUB CHAPTER
            newChapter.href +
            `${result?.length ? '#' + result : ''}` + // this is to make the sub chapter menu appears to be selected
            '___' +
            currentBookData?.bookName +
            '_children_' +
            currentBookData?.bookLink;

          hrefForSubChapter = // this will be used when someone click on the actual sub chapter CASE 2 => CLICK ON ACTUAL SUB CHAPTER
            newChapter.href +
            `${result?.length ? '#' + result : ''}` + // this is to make the sub chapter menu appears to be selected
            '___' +
            currentBookData?.bookName;

          hrefForBook = // this one will be used when someone click the sub chapter to make teh parent of sub chapter as open one
            newChapter.href +
            '___' +
            currentBookData?.bookName +
            '_children_' +
            currentBookData?.bookLink;

          newBookUrl = currentBookData?.bookLink + '=>' + hrefForBook; // this is to make the book which have sub chapters and the sub chapters parent appeared to be selected if someone clicks on them (open)
        }
        // CASE 3 SOME ONE CLICKED ON THE SIMPLE CHAPTER
        if (result?.length > 0) {
          setSelectedKeys([`${hrefForSubChapter}`]); // THIS WILL ONLY BE RUN WHEN SOME ONE CLICK ON ACTUAL SUB CHAPTER
        } else {
          setSelectedKeys(
            // THIS WILL BE RUN TWICE EITHER SOME ONE CLICK ON SIMPLE CHAPTER OR THE PARENT OF SUB CHAPTER
            newChapterHref.split('___').length > 1 || // this means that the simple chapter is clicked which is not a subchapter
              newChapterHref.split('#').length > 1 // this means that a subchapter is clicked
              ? [newChapterHref] // we will just set this as same
              : [
                  newChapterHref + // this is to make the sub chapter menu appears to be selected
                    `${
                      currentBookData?.bookName
                        ? '___' + currentBookData?.bookName
                        : ''
                    }`,
                ],
          );
        }

        newBookUrl.length > 0 && setOpenKeys([...newBookUrl.split('=>')]);
        setProceedNext(true);
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleZoomIn = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    setZoomLevel(zoomLevel + 2);
    handleZoom(zoomLevel + 2);
  };

  const handleZoomOut = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    setZoomLevel(zoomLevel - 2);
    handleZoom(zoomLevel - 2);
  };

  return (
    <div className="searchedBook">
      <div id="viewer-container">
        <div id="book-container" ref={bookContainerRef}></div>
      </div>

      <div
        className={`buttonsNav ${
          singlePageMode ? 'singlePageMode' : 'multiplePageMode'
        } `}
      >
        {singlePageMode ? (
          <>
            <div className="searchPageNumbers">
              <Button
                onClick={() => parentRendition.prev()}
                disabled={disableBackward}
                shape="circle"
              >
                <GrPrevious />
              </Button>
              <p>
                {` ${currentPage}`} {'/'} {`${totalPages} `}
                {t('in this Section')}
              </p>
              <Button
                onClick={() => parentRendition.next()}
                disabled={disableFroward}
                shape="circle"
              >
                <GrNext />
              </Button>
            </div>
            <div className="searchZoomButtons">
              <div className="buttonsContainer">
                <Button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0 ? true : false}
                  className="zoomButtons"
                >
                  <MinusLogo width={'14'} />
                </Button>
                <span className="zoomValue">
                  {Math.round(((zoomLevel + 2) / 20) * 100)}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 18 ? true : false}
                  className="zoomButtons"
                >
                  <PlusLogo width={'14'} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="pageNumbersFooter noMarginBottom ">
              <Button
                onClick={() => parentRendition.prev()}
                disabled={disableBackward}
                shape="circle"
              >
                <GrPrevious />
              </Button>
              <p>
                {` ${currentPage?.startPage}`} {t('of')}{' '}
                {`${totalPages?.startPages} `}
                {t('in this Section')}
              </p>
            </span>
            <div className="buttonsContainer">
              <Button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0 ? true : false}
                className="zoomButtons"
              >
                <MinusLogo width={'14'} />
              </Button>
              <span className="zoomValue">
                {Math.round(((zoomLevel + 2) / 20) * 100)}%
              </span>
              <Button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 18 ? true : false}
                className="zoomButtons"
              >
                <PlusLogo width={'14'} />
              </Button>
            </div>
            <span className="pageNumbersFooter noMarginBottom ">
              <p>
                {` ${currentPage?.endPage}`} {t('of')}{' '}
                {`${totalPages?.endPages} `}
                {sameSectionOpened
                  ? t('in this Section')
                  : t('in next Section')}
              </p>
              <Button
                onClick={() => parentRendition.next()}
                disabled={disableFroward}
                shape="circle"
              >
                <GrNext />
              </Button>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchedBook;
