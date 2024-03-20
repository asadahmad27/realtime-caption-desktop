import React, { useEffect, useState } from 'react';
import ePub, { NavItem } from 'epubjs';
import type { MenuProps } from 'antd';
import { Layout, Menu, Skeleton } from 'antd';
import { Logo, BookLogo } from '../../../../../assets/iconsCustom/Svgs';
import {
  BookInterface,
  bookInfo,
  locationsFound,
} from '../../../utils/interfaces';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { RootState } from '../../../redux/store';
import { useTranslation } from 'react-i18next';
import CustomTooltip from '../../Tooltip/Tooltip';
import './Sidebar.css';

const { Sider } = Layout;
interface menuPropsType extends BookInterface {
  chapters: NavItem[];
}
type MenuItem = Required<MenuProps>['items'][number];

type GenerateMenuItemsFn = (
  chapters: NavItem[],
  book: BookInterface,
) => MenuItem[];

interface sidebarProps {
  AllBooks: BookInterface[];
  setCurrentBookAndChapter: React.Dispatch<React.SetStateAction<bookInfo>>;
  searchPage?: boolean;
  currentBookAndChapter?: { book: string; chapter: string };
  setAllBooksChapters?: React.Dispatch<React.SetStateAction<NavItem[][]>>;
  setCurrentBookName?: React.Dispatch<React.SetStateAction<string>>;
  openKeys: string[];
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setOpenKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
  proceedNext: boolean;
  searchResults?: locationsFound[];
  currentBookName?: string;
  collapseIcon?: boolean;
  collapsableSidebar?: boolean;
}

const Sidebar: React.FC<sidebarProps> = ({
  AllBooks,
  setCurrentBookAndChapter,
  currentBookAndChapter,
  setAllBooksChapters,
  setCurrentBookName,
  searchPage,
  openKeys,
  selectedKeys,
  setOpenKeys,
  setSelectedKeys,
  setProceedNext,
  proceedNext,
  searchResults,
  currentBookName,
  collapseIcon,
  collapsableSidebar,
}) => {
  // const [menuPropsValues, setMenuPropsValues] = useState<menuPropsType[]>([]);
  const [allBooksMenuProps, setAllBooksMenuProps] = useState<
    MenuProps['items']
  >([]);
  const navigate = useNavigate();
  const searchBooks: CheckboxValueType[] = useSelector(
    (state: RootState) => state.booksData.books,
  );
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const compilationActive = searchParams.get('compilation');
  const bookId = searchParams.get('bookId');

  useEffect(() => {
    calculateTOC();
  }, [AllBooks, searchBooks]);

  useEffect(() => {
    if (currentBookAndChapter && allBooksMenuProps?.length) {
      const currentBookShown: BookInterface = AllBooks.find(
        (book) => book.bookLink === currentBookAndChapter.book.split('=>')[0],
      ) as BookInterface;
      setSelectedKeys &&
        setSelectedKeys(
          currentBookAndChapter.chapter.split('___').length > 1 || // this means that the simple chapter is clicked which is not a subchapter
            currentBookAndChapter.chapter.split('#').length > 1 // this means that a subchapter is clicked
            ? [currentBookAndChapter.chapter] // we will just set this as same
            : [
                currentBookAndChapter.chapter + // this is to make the sub chapter menu appears to be selected
                  `${
                    currentBookShown?.bookName
                      ? '___' + currentBookShown?.bookName
                      : ''
                  }`,
              ],
        );
      console.log('all books menu', allBooksMenuProps, currentBookAndChapter);
      setOpenKeys([...currentBookAndChapter.book.split('=>')]);
    }
  }, [allBooksMenuProps, currentBookAndChapter]);

  const calculateTOC = async () => {
    let filteredBooks: BookInterface[] = [];
    if (compilationActive === 'true') {
      filteredBooks = AllBooks?.filter((item) => item._id === bookId);
    } else {
      filteredBooks = AllBooks?.filter((item) =>
        searchBooks.includes(item.bookLink as CheckboxValueType),
      );
    }
    const booksToConsider = filteredBooks?.length ? filteredBooks : AllBooks;
    const selectedBooks = searchPage ? booksToConsider : AllBooks;

    let allChaptersData: NavItem[][] = [];
    let allBooksAndChapters: any = [];

    for (const [index, book] of selectedBooks.entries()) {
      const singleBook = ePub(book.bookLink || '');

      try {
        const toc = await singleBook.loaded.navigation;

        const modifiedToc = toc.toc.slice();
        modifiedToc.splice(1, 2); // Remove second and third items

        allChaptersData.push(modifiedToc);
        allBooksAndChapters.push({
          ...book,
          chapters: modifiedToc,
        });

        // Update state after each book's chapters are calculated
        const menuProps = mapToMenuItem(book, modifiedToc, index);
        setAllBooksMenuProps(
          (prevState) => prevState && [...prevState, menuProps],
        );

        // Check if this is the last book, then finalize state update
        if (index === selectedBooks.length - 1) {
          handleFinalMenuPropsValues(allBooksAndChapters);
          setAllBooksChapters && setAllBooksChapters(allChaptersData);
        }
      } catch (error) {
        // Handle error accordingly, e.g., set default chapters or retry
      }
    }
  };

  // Create a function to generate menu props from a book
  const mapToMenuItem = (
    book: BookInterface,
    chapters: NavItem[],
    index: number,
  ): MenuItem => {
    return {
      key: book.bookLink || index.toString(),
      icon: React.createElement(BookLogo),
      label: <CustomTooltip title={book.bookName || 'No Name'} />,
      children: chapters ? generateMenuItems(chapters, book) : undefined,
    };
  };

  const handleFinalMenuPropsValues = (allValues: menuPropsType[]): void => {
    const tempValues: MenuItem[] = allValues.map((singleBook, index) =>
      mapToMenuItem(singleBook, singleBook.chapters, index),
    );
    setAllBooksMenuProps(tempValues);
  };

  const generateMenuItems: GenerateMenuItemsFn = (chapters, book) => {
    return chapters.map((chapter) => {
      if (chapter.subitems && chapter.subitems.length > 0) {
        const subMenuItems = generateMenuItems(chapter.subitems, book);
        return {
          key:
            chapter.href + '___' + book.bookName + '_children_' + book.bookLink,
          label: <CustomTooltip title={chapter.label} />,
          children: subMenuItems,
        };
      } else {
        return {
          key: chapter.href + '___' + book.bookName,
          label: <CustomTooltip title={chapter.label} />,
        };
      }
    });
  };

  const handleChapterNavigation = (itemKeyPath: string[]) => {
    const newBook = AllBooks.filter(
      (book) => book.bookLink === itemKeyPath[itemKeyPath.length - 1],
    );
    setCurrentBookName && setCurrentBookName(newBook[0].bookName as string);
    let openKeys = '';
    for (let i = itemKeyPath.length - 1; i >= 1; i--) {
      openKeys = openKeys.length
        ? openKeys + '=>' + itemKeyPath[i]
        : itemKeyPath[i];
    }

    setCurrentBookAndChapter!({
      book: openKeys,
      chapter: itemKeyPath[0],
    });
  };
  const handleOpenChange = (keys: string[]) => {
    if (keys?.length && keys[keys.length - 1].includes('_children_')) {
      if (
        (searchPage && // this is to check if the page is search page
          searchResults !== undefined && // this is to check if the search results are fetched
          !searchResults.length && // this is to check if the search results are empty
          keys[keys.length - 1].includes(currentBookName as string)) || // this is to check any chapter of current book is clicked
        (searchPage && !searchBooks.length) // this is to check if the search books are selected)
      ) {
        return false;
      }
      if (!proceedNext) return;
      setProceedNext(false);
      const newChapter = keys[keys.length - 1];
      const newBook = newChapter.split('_children_')[1];
      const newBookData = AllBooks.filter((book) => book.bookLink === newBook);
      setCurrentBookName &&
        setCurrentBookName(newBookData[0].bookName as string);
      setCurrentBookAndChapter(() => ({
        book: newBook + '=>' + newChapter,
        chapter: newChapter,
      }));
    }

    setOpenKeys(keys);
  };

  const handleItemClick = (item: any) => {
    if (
      (searchPage &&
        searchResults !== undefined &&
        !searchResults.length && // this is to check if the search results are empty
        item.key.split('___')[1] === currentBookName) || // this is to check any chapter of current book is clicked
      (searchPage && !searchBooks.length) // this is to check if the search books are selected)
    ) {
      return false;
    }
    if (!proceedNext) return;
    setProceedNext(false);
    handleChapterNavigation(item.keyPath);
  };

  return (
    <Layout hasSider className="primarySidebar">
      <Sider
        width={'100%'}
        className={`sidebarContainer ${
          collapseIcon ? 'collapsableSidebar' : ''
        } ${collapsableSidebar ? 'noWidth' : ''} `}
      >
        <div className="logoContainer padLeft">
          <span onClick={() => navigate('/')}>
            <Logo />
          </span>
        </div>
        {allBooksMenuProps && allBooksMenuProps?.length > 0 ? (
          <Menu
            key={allBooksMenuProps?.length}
            mode="inline"
            defaultSelectedKeys={['1']}
            items={allBooksMenuProps}
            onClick={handleItemClick}
            className="chaptersList"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
          />
        ) : (
          <div className="skelotonParant">
            <Skeleton paragraph={{ rows: 13 }} active title={false} />
          </div>
        )}
      </Sider>
    </Layout>
  );
};

export default Sidebar;
