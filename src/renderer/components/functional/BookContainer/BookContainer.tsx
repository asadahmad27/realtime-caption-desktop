import React, { useEffect, useRef, useState } from 'react';
import ePub, { Location, NavItem } from 'epubjs';
import { BookInterface } from '../../../utils/interfaces';
import {
  getAllBookData,
  makeLocationsForProgress,
} from '../../../utils/functions';
import { useSearchParams } from 'react-router-dom';
import { FaCircleInfo } from 'react-icons/fa6';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import './BookContainer.css';

interface bookContainerProps {
  currentBookAndChapter: { book: string; chapter: string };
  setCurrentChapterIndex: React.Dispatch<React.SetStateAction<string>>;
  parentRendition: any;
  setParentRendition: React.Dispatch<any>;
  totalChapters: NavItem[];
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setDisableForward: React.Dispatch<React.SetStateAction<boolean>>;
  setDisableBackward: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentCfi: React.Dispatch<React.SetStateAction<string>>;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookContainer: React.FC<bookContainerProps> = ({
  currentBookAndChapter,
  setCurrentChapterIndex,
  totalChapters,
  parentRendition,
  setParentRendition,
  setProgress,
  setDisableBackward,
  setDisableForward,
  setOpenKeys,
  setSelectedKeys,
  setProceedNext,
  setCurrentCfi,
}) => {
  const [currentBook, setCurrentBook] = useState<BookInterface>({});
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState<any>(0);
  const [singlePageMode, setSinglePageMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<any>(0);
  const [sameSectionOpened, setSameSectionOpened] = useState<boolean>(true);
  const [bookToRender, setBookToRender] = useState<any>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const [navigatedCfi, setNavigatedCfi] = useState<string>('');
  const cfiToNavigate = searchParams.get('cfi');
  const compilationActive = searchParams.get('compilation');
  const bookId = searchParams.get('bookId');

  const allBooksData: { data: BookInterface[] } = getAllBookData(
    compilationActive === 'true' ? true : false,
  );
  useEffect(() => {
    if (cfiToNavigate) {
      setNavigatedCfi(cfiToNavigate);
    }
  }, [cfiToNavigate]);
  useEffect(() => {
    if (allBooksData?.data?.length && totalChapters?.length) {
      renderBook(allBooksData?.data);
    }
  }, [allBooksData, currentBookAndChapter, totalChapters]);
  const removeFirstChildIfMultiple = () => {
    const container = bookContainerRef.current;
    if (container && container.children.length > 1) {
      while (container.children.length > 1) {
        container.removeChild(container.children[0]); // Remove the first child
      }
    }
  };

  useEffect(() => {
    // Run this function after 300 milliseconds
    const timer = setTimeout(removeFirstChildIfMultiple, 700); // this is because epub mistakenly duplicates the book render view

    // Clean up the timer if the component unmounts or the dependency changes
    return () => clearTimeout(timer);
  }, [bookContainerRef.current]);

  const renderBook = async (AllBooks: BookInterface[]) => {
    let rendition: any = null;
    const currentBookToRender: BookInterface[] =
      AllBooks?.filter(
        (singleBook) =>
          singleBook.bookLink === currentBookAndChapter?.book.split('=>')[0],
      ) || [];
    let newBook: any;
    let newBookUrl: string;
    if (currentBookToRender[0]?.bookLink) {
      newBookUrl = currentBookToRender[0]?.bookLink;
    } else {
      newBookUrl = AllBooks[0]?.bookLink || '';
    }

    if (
      currentBook?.bookLink !== currentBookToRender[0]?.bookLink ||
      !parentRendition
    ) {
      newBook = ePub(newBookUrl);
      bookToRender?.destroy();

      rendition = newBook.renderTo('viewer', {
        manager: 'continuous',
        flow: 'paginated', // Change to "paginated"
        width: '100%',
        height: '100%',
      });
      rendition.themes.font('Lato');
      setBookToRender(newBook);
      setParentRendition(rendition);
      setCurrentBook(
        currentBookToRender[0] ? currentBookToRender[0] : AllBooks[0],
      );

      // Call the function with the TOC data
      await newBook.ready;
      await makeLocationsForProgress(newBook); // Wait for locations to be generated
      findTotalProgress(rendition, newBook, totalChapters);
      rendition.display(
        navigatedCfi
          ? cfiToNavigate
          : currentBookAndChapter?.chapter.split('___')[0] ||
              totalChapters[0].href,
      );
    } else {
      parentRendition.display(currentBookAndChapter?.chapter.split('___')[0]);
      const chapterIndex = totalChapters.findIndex(
        (chapter) =>
          chapter.href === currentBookAndChapter?.chapter.split('___')[0],
      );
      setCurrentChapterIndex(chapterIndex.toString());
    }
  };

  const findTotalProgress = async (
    rendition: any,
    book: any,
    totalChaptersData: NavItem[],
  ) => {
    try {
      rendition.on('relocated', function (locations: Location) {
        console.log(locations, 'locations');
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

        let progress = book.locations.percentageFromCfi(locations.start.cfi);
        progress = Math.round(progress * 100);
        setProgress(progress);
        setCurrentCfi(locations.start.cfi);
        let chapterHref = locations.start.href;
        const chapterIndex = totalChaptersData.length
          ? totalChaptersData.findIndex(
              (chapter: any) => chapter.href === chapterHref,
            )
          : 0;
        if (locations.start.displayed.page === 1 && chapterIndex === 0) {
          setDisableBackward(true);
        } else {
          setDisableBackward(false);
        }

        if (
          locations.end.displayed.page === locations.end.displayed.total &&
          chapterIndex === totalChaptersData.length - 1
        ) {
          setDisableForward(true);
        } else {
          setDisableForward(false);
        }

        setCurrentChapterIndex(chapterIndex.toString());

        // to se the selected key for side bar
        let currentBookData: BookInterface = {};
        if (compilationActive === 'true') {
          currentBookData = allBooksData?.data?.find(
            (item: BookInterface) => item._id === bookId,
          ) as BookInterface;
        } else {
          currentBookData = allBooksData.data.find(
            (item: BookInterface) =>
              item.bookLink === currentBookAndChapter.book.split('=>')[0],
          ) as BookInterface;
        }

        const newChapter: NavItem = totalChaptersData?.find(
          (item) => item.href === locations.start.href,
        ) as NavItem;

        let newChapterHref = newChapter.href;
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

  return (
    <div>
      <div id="viewer-container">
        <div
          id="viewer"
          style={{ height: 'calc(100vh - 370px)' }}
          ref={bookContainerRef}
        ></div>

        <div
          className={`pageNumbersFooter ${
            singlePageMode ? 'singlePageMode' : 'multiplePageMode'
          } `}
        >
          {singlePageMode ? (
            <>
              <p>
                Page
                {` ${currentPage}`} {t('of')} {`${totalPages} `}
                {t('in this Section')}
              </p>
              <span className="infoIcon">
                <Tooltip
                  placement="top"
                  title={t('PageNumberTooltip')}
                  overlayClassName="pageNumberInfo"
                >
                  <FaCircleInfo />
                </Tooltip>
              </span>
            </>
          ) : (
            <>
              <p>
                Page
                {` ${currentPage?.startPage}`} {t('of')}
                {`${totalPages?.startPages} `}
                {t('in this Section')}
              </p>
              <span className="pageNumbersFooter noMarginBottom ">
                <p>
                  Page
                  {` ${currentPage?.endPage}`} {t('of')}
                  {`${totalPages?.endPages} `}
                  {sameSectionOpened
                    ? t('in this Section')
                    : t('in next Section')}
                </p>
                <span className="infoIcon">
                  <Tooltip
                    placement="top"
                    title={t('PageNumberTooltip')}
                    overlayClassName="pageNumberInfo"
                  >
                    <FaCircleInfo />
                  </Tooltip>
                </span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookContainer;
