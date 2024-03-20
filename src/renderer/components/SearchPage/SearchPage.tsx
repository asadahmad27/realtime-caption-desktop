import React, { useState, useEffect } from 'react';
import { Col, Row, Tooltip } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import ePub, { NavItem } from 'epubjs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BookOptions } from 'epubjs/types/book';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useTranslation } from 'react-i18next';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { getAllBookData, processSearchValue } from '../../utils/functions';
import { LeftArrow } from '../../../../assets/iconsCustom/Svgs';
import { RootState } from '../../redux/store';
import { Sidebar } from '../../components/commonComponents';
import {
  BookInterface,
  bookInfo,
  locationsFound,
} from '../../utils/interfaces';
import {
  PrimaryLayout,
  SearchedList,
  SearchedBook,
} from '../../components/functional';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searching, setSearching] = useState<boolean>(false);
  const [cfiToNavigate, setCfiToNavigate] = useState<string>('');
  const [bookIndexWithSearch, setBookIndexWithSearch] = useState<number>(-1);
  const [currentBookChapters, setCurrentBookChapters] = useState<NavItem[]>([]);
  const [selectedCfi, setSelectedCfi] = useState<string>('');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<locationsFound[]>([]);
  const [parentRendition, setParentRendition] = useState<any>(null);
  const [currentBookAndChapter, setCurrentBookAndChapter] = useState<bookInfo>({
    book: '',
    chapter: '',
  });
  const [firstSearchResult, setFirstSearchResult] = useState<string>('');
  const [oldSearchText, setOldSearchText] = useState<string>('');
  const [collapseIcon, setCollapseIcon] = useState<boolean>(false);
  const [collapsableSidebar, setCollapsableSidebar] = useState<boolean>(false);
  const [searchCollapseIcon, setSearchCollapseIcon] = useState<boolean>(false);
  const [collapsableSearchSection, setCollapsableSearchSection] =
    useState<boolean>(false);
  const [navigateToOnlyCfi, setNavigateToOnlyCfi] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);
  const [currentBookName, setCurrentBookName] = useState<string>('');
  const [allBooks, setAllBooks] = useState<BookInterface[]>([]);
  const [proceedNext, setProceedNext] = useState<boolean>(true);
  const [currentBookMatchedResults, setCurrentBookMatchedResults] =
    useState<number>(0);
  const [totalMatchFound, setTotalMatchFound] = useState<number>(0);
  const [searchParams] = useSearchParams();

  // stateless variables

  const { t } = useTranslation();
  let { searchText } = useParams();
  searchText = processSearchValue(searchText as string);
  const compilationActive = searchParams.get('compilation');
  const searchBooks: CheckboxValueType[] = useSelector(
    (state: RootState) => state.booksData.books,
  );
  const bookId = searchParams.get('bookId');
  // const [oldBookAndChapter, setOldBookAndChapter] = useState<bookInfo>({
  //   book: "",
  //   chapter: "",
  // });

  const allBooksResponse = getAllBookData(
    compilationActive === 'true' ? true : false,
  );
  function getAllBooks() {
    if (compilationActive === 'true') {
      const filteredBooks = allBooksResponse?.data?.filter(
        (item: BookInterface) => item._id === bookId,
      );
      setAllBooks(filteredBooks || []);
    } else {
      setAllBooks(allBooksResponse?.data || []);
    }
  }
  const renderSearchResults = async () => {
    if (allBooks.length) {
      let filteredBooks: BookInterface[] = [];
      if (compilationActive === 'true') {
        filteredBooks = allBooks?.filter(
          (item: BookInterface) => item._id === bookId,
        );
      } else {
        filteredBooks = allBooks.filter((item) =>
          searchBooks.includes(item.bookLink as CheckboxValueType),
        );
      }

      setSearching(true);
      const bookIndexWithSearchResults = await handleMultiBooksSearch(
        searchText || '',
        filteredBooks,
      );

      setBookIndexWithSearch(bookIndexWithSearchResults);
      if (
        !currentBookAndChapter.book &&
        !currentBookAndChapter.chapter &&
        filteredBooks.length
      ) {
        if (bookIndexWithSearchResults > -1) {
          setCurrentBookAndChapter((old) => ({
            book: filteredBooks[bookIndexWithSearchResults].bookLink as string,
            chapter: old.chapter ? old.chapter : 'Text/cover.xhtml',
          }));

          setCurrentBookName(
            filteredBooks[bookIndexWithSearchResults].bookName as string,
          );
          handleSearch(
            searchText,
            filteredBooks[bookIndexWithSearchResults].bookLink as string,
          );
        } else {
          setSearching(false);
          setSearchResults([]);
        }
      } else {
        handleSearch(
          searchText,
          currentBookAndChapter.book.split('=>')[0] as string,
        );
      }
      const currentBookData: BookInterface = allBooks.find(
        (item) => item.bookLink === currentBookAndChapter.book.split('=>')[0],
      ) as BookInterface;

      if (currentBookName !== currentBookData?.bookName)
        setCurrentBookName(currentBookData?.bookName as string);

      // setOldBookAndChapter(currentBookAndChapter);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // For smooth scrolling, use 'auto' for instant scrolling
    });
    if (allBooksResponse?.data?.length) {
      getAllBooks();
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [allBooksResponse]);

  const handleWindowResize = () => {
    setKey(Math.floor(Math.random() * 100) + 1);
  };
  useEffect(() => {
    if (!proceedNext) {
      setTimeout(() => {
        setProceedNext(true);
      }, 1500);
    }
  }, [proceedNext]);

  useEffect(() => {
    renderSearchResults();
  }, [searchText, searchBooks, allBooks, currentBookAndChapter.book]);
  const handleSearch = async (
    searchText: string | undefined,
    filteredBook: string,
  ) => {
    if (searchResults.length) {
      searchResults.map((item) => {
        item.chapterResults.map((result) => {
          parentRendition.annotations.remove(result.cfi, 'underline');
        });
      });
    }
    const book = ePub(filteredBook as BookOptions);
    // Wait for the book to load
    await book.ready;

    if (searchText) {
      let currentBookMatches = 0;
      const searchRegex = new RegExp(searchText, 'gi');
      const foundLocations: locationsFound[] = [];
      // Iterate over spine items (sections) to search for text
      for (const section of (book.spine as any).spineItems) {
        if (section.isNav) {
          // Skip navigation items
          continue;
        }

        // Wait for the section to load
        await section.load(book.load.bind(book));

        // Use the `find` method to search within the section
        const searchResultsInSection = section.find(searchText);

        if (searchResultsInSection.length > 0) {
          // Modify the search results to replace search text with a <span>
          const modifiedResults = searchResultsInSection.map((result: any) => {
            currentBookMatches += 1;
            const excerptWithSpan = result.excerpt.replace(
              searchRegex,
              (match: string) => `<span class="textFound">${match}</span>`,
            );

            return {
              cfi: result.cfi,
              excerpt: excerptWithSpan,
            };
          });

          await book.loaded.navigation.then(function (toc) {
            const modifiedToc = toc.toc.slice();
            modifiedToc.splice(1, 2); // Remove second and third items
            const allChaptersNames = modifiedToc;

            setCurrentBookChapters(allChaptersNames);
            const currentChapterAndName = allChaptersNames.find(
              (item) => item.href === section.href,
            );

            foundLocations.push({
              chapterResults: [...modifiedResults],
              chapterName: currentChapterAndName?.label || '',
              chapterNumber: section.index + 2,
              chapterHref: section.href,
            });
          });
        }
      }
      setCurrentBookMatchedResults(currentBookMatches);
      // Update the state with search results
      setSearchResults(foundLocations);
      if (!foundLocations.length) {
        setProceedNext(true);
      }
      if (
        foundLocations[0]?.chapterResults?.length &&
        firstSearchResult === ''
      ) {
        setFirstSearchResult(foundLocations[0].chapterResults[0].cfi);
      } else {
        setFirstSearchResult('empty');
      }
    } else {
      setSearchResults([]);
      setCurrentBookAndChapter((old) => ({
        book: old.book,
        chapter: '',
      }));
    }
    setSearching(false);
  };

  const handleMultiBooksSearch = async (
    searchText: string,
    filteredBooks: BookInterface[],
  ) => {
    let bookIndexWithSearchResults = -1;
    if (bookIndexWithSearch > -1 && oldSearchText === searchText)
      return bookIndexWithSearch;
    setOldSearchText(searchText);
    if (searchText) {
      let combinedResults: number = 0;

      for (const book of filteredBooks) {
        const bookInstance = ePub(book.bookLink as BookOptions);
        await bookInstance.ready;
        let foundLocations: number = 0;

        // Load the book
        await bookInstance.ready;

        // Iterate over spine items (sections) to search for text
        for (const section of (bookInstance.spine as any).spineItems) {
          if (section.isNav) {
            // Skip navigation items
            continue;
          }

          // Wait for the section to load
          await section.load(bookInstance.load.bind(bookInstance));

          // Use the `find` method to search within the section
          const searchResultsInSection = section.find(searchText);

          if (searchResultsInSection.length > 0) {
            // Modify the search results to replace search text with a <span>

            foundLocations += searchResultsInSection.length;
          }
        }

        if (foundLocations && bookIndexWithSearchResults === -1) {
          bookIndexWithSearchResults = filteredBooks.findIndex(
            (item) => item.bookLink === book.bookLink,
          );
        }
        combinedResults += foundLocations;
      }

      // Update the state with search results

      setTotalMatchFound(combinedResults);
      return bookIndexWithSearchResults;
    } else {
      setTotalMatchFound(0);
      return -1;
    }
  };

  const setCfiToNavigateAndChapter = (cfi: string, chapter: string) => {
    if (!proceedNext) return;
    setProceedNext(false);
    const currentBookData: BookInterface = allBooks.find(
      (item) => item.bookLink === currentBookAndChapter.book.split('=>')[0],
    ) as BookInterface;

    const newChapter = currentBookChapters.find(
      (item) => item.href === chapter,
    ) as NavItem;
    let newChapterHref = newChapter.href;
    let newBook = '';
    if (newChapter.subitems?.length) {
      newChapterHref =
        newChapter.href +
        '___' +
        currentBookData?.bookName +
        '_children_' +
        currentBookData?.bookLink;
      newBook = currentBookData?.bookLink + '=>' + newChapterHref;
    }

    setCurrentBookName(currentBookData?.bookName as string);
    setTimeout(() => {
      parentRendition.display(cfi);
      setSelectedCfi(cfi);
    }, 0);
    setCfiToNavigate(cfi);
    setNavigateToOnlyCfi(true);
    setCurrentBookAndChapter((old) => ({
      book: newBook.length ? newBook : old.book,
      chapter: newChapterHref || '',
    }));
  };

  const browserBack = () => {
    navigate('/home');
  };

  function colsValueForBookSection(
    sidebarCollapsed: boolean,
    searchSectionCollapsed: boolean,
  ) {
    if (sidebarCollapsed && searchSectionCollapsed) {
      return 23;
    } else if (sidebarCollapsed && !searchSectionCollapsed) {
      return 12;
    } else if (!sidebarCollapsed && searchSectionCollapsed) {
      return 18;
    } else {
      return 9;
    }
  }

  function colsValueForSearchSection(
    sidebarCollapsed: boolean,
    searchSectionCollapsed: boolean,
  ) {
    if (searchSectionCollapsed) {
      return 0;
    } else if (sidebarCollapsed && !searchSectionCollapsed) {
      return 24;
    } else {
      return 24;
    }
  }

  return (
    <PrimaryLayout key={key}>
      <div className="SearchResults">
        <Row gutter={24}>
          <Col md={collapsableSidebar ? 1 : 6} className="centeredDiv">
            <div style={{ display: collapsableSidebar ? 'none' : 'block' }}>
              <Sidebar
                AllBooks={allBooks}
                searchPage={true}
                currentBookAndChapter={currentBookAndChapter}
                setCurrentBookAndChapter={setCurrentBookAndChapter}
                setCurrentBookName={setCurrentBookName}
                setOpenKeys={setOpenKeys}
                setSelectedKeys={setSelectedKeys}
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                proceedNext={proceedNext}
                setProceedNext={setProceedNext}
                searchResults={searchResults}
                currentBookName={currentBookName}
                collapseIcon={collapseIcon}
                collapsableSidebar={collapsableSidebar}
              />
            </div>
          </Col>
          <Col md={collapsableSidebar ? 23 : 18}>
            <div
              onMouseEnter={() => setCollapseIcon(true)}
              onClick={() => {
                setCollapsableSidebar(!collapsableSidebar);
                setKey(Math.floor(Math.random() * 100) + 1);
                setCollapseIcon(false);
              }}
              onMouseLeave={() => setCollapseIcon(false)}
              className="collapseIcon"
              style={{ left: collapsableSidebar ? '0%' : '21%' }}
            >
              {collapsableSidebar ? (
                <Tooltip
                  title={t('Expand Sidebar')}
                  overlayClassName="pageNumberInfo"
                  placement="right"
                >
                  <div className="sectionCollapse">
                    {' '}
                    <GrNext />{' '}
                  </div>
                </Tooltip>
              ) : (
                <Tooltip
                  title={t('Collapse Sidebar')}
                  placement="right"
                  overlayClassName="pageNumberInfo"
                >
                  <div className="sectionCollapse">
                    <GrPrevious />
                  </div>
                </Tooltip>
              )}
            </div>
            <div
              style={{ right: '0%' }}
              onMouseEnter={() => setSearchCollapseIcon(true)}
              onClick={() => {
                setCollapsableSearchSection(!collapsableSearchSection);
                setKey(Math.floor(Math.random() * 100) + 1);
                setSearchCollapseIcon(false);
              }}
              onMouseLeave={() => setSearchCollapseIcon(false)}
              className="collapseIcon"
            >
              {collapsableSearchSection ? (
                <Tooltip
                  title={t('Expand Search Results')}
                  placement="right"
                  overlayClassName="pageNumberInfo"
                >
                  <div className="sectionCollapse">
                    {' '}
                    <GrPrevious />{' '}
                  </div>
                </Tooltip>
              ) : null}
            </div>
            <div className="browserBack searchPageBack" onClick={browserBack}>
              <LeftArrow />
              {t('Back')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SearchedList
                searchResults={searchResults}
                setCfiToNavigateAndChapter={setCfiToNavigateAndChapter}
                totalMatchFound={totalMatchFound}
                currentBookMatchedResults={currentBookMatchedResults}
                currentBookName={currentBookName}
                selectedCfi={selectedCfi}
                parentRendition={parentRendition}
                searching={searching}
                setCurrentBookAndChapter={setCurrentBookAndChapter}
                currentBookIndex={searchBooks.findIndex(
                  (item) =>
                    item === currentBookAndChapter?.book?.split('=>')[0],
                )}
                cfiToNavigate={cfiToNavigate}
                proceedNext={proceedNext}
                setProceedNext={setProceedNext}
                currentBookAndChapter={currentBookAndChapter}
              />
              <div
                style={{ right: '0%', position: 'static' }}
                onMouseEnter={() => setSearchCollapseIcon(true)}
                onClick={() => {
                  setCollapsableSearchSection(!collapsableSearchSection);
                  setKey(Math.floor(Math.random() * 100) + 1);
                  setSearchCollapseIcon(false);
                }}
                onMouseLeave={() => setSearchCollapseIcon(false)}
                className="collapseIcon"
              >
                {collapsableSearchSection ? null : (
                  <Tooltip
                    title={t('Collapse Search Results')}
                    placement="right"
                    overlayClassName="pageNumberInfo"
                  >
                    <div className="sectionCollapse">
                      <GrNext />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </PrimaryLayout>
  );
};

export default SearchPage;
