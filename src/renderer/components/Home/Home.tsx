import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../commonComponents';
import { useDispatch } from 'react-redux';
import { BookInterface } from '../../utils/interfaces';
import BookCard from '../commonComponents/BookCard/BookCard';
import { sidebarChange } from '../../redux/search/SearchBooksSlice';
import { getAllBookData } from '../../utils/functions';
import useComponentVisible from '../../utils/useComponentVisible';
import './Home.css';

const { Item } = Menu;

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleMenuClick = (sortOption: any) => {
    setSortBy(sortOption);
    setDropdownVisible(false);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(isVisible);

  const toggleDropdown = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const books = Array.from({ length: 12 }, (_, index) => ({
    id: index,
  }));

  const menu = (
    <Menu onClick={handleMenuClick} className="sortDropdown2">
      <Item key="title">{t('Recently Opened')}</Item>
      <Item key="author">{t('Favorite')}</Item>
      <Item key="author">{t('A-Z')}</Item>
      <Item key="author">{t('Z-A')}</Item>
    </Menu>
  );

  const [selectedBook, setSelectedBook] = useState<BookInterface>({});
  const [compilationBookClicked, setCompilationBookClicked] =
    useState<boolean>(false);
  const handleShowDrawer = (
    bookData: BookInterface,
    compilations?: boolean,
  ) => {
    if (bookData._id === selectedBook._id || !selectedBook?._id) {
      setShowDrawer(!showDrawer);
      dispatch(sidebarChange());
    }
    setSelectedBook(bookData);
    if (compilations) {
      setCompilationBookClicked(true);
    } else {
      setCompilationBookClicked(false);
    }
  };

  const allBooksData = getAllBookData(false);
  const allCompilationsData = getAllBookData(true);
  return (
    <>
      <Navbar />
      <div className={`dashboardContent`}>
        <div className="booksHeadingContainer">
          <h3 className="booksHeading">{t('Books')}</h3>
          <div className="sortDiv">
            <div className="dropdown">
              <button className="dropdownToggle" onClick={toggleDropdown}>
                {t('Sort by:')}
                {!isComponentVisible ? <DownOutlined /> : <UpOutlined />}
              </button>
              {isComponentVisible && (
                <div ref={ref} className="dropdownMenu">
                  <button onClick={() => handleMenuClick('recent')}>
                    {t('Recently Opened')}
                  </button>
                  <button onClick={() => handleMenuClick('favorite')}>
                    {t('Favorite')}
                  </button>
                  <button onClick={() => handleMenuClick('a-z')}>
                    {t('A-Z')}
                  </button>
                  <button onClick={() => handleMenuClick('z-a')}>
                    {t('Z-A')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="booksContainer">
          {allBooksData ? (
            allBooksData.data?.map((book: BookInterface) => (
              <BookCard key={book._id} bookData={book} />
            ))
          ) : (
            <p>No books available</p>
          )}
        </div>

        <h3 className="compilationsHeading">{t('Compilations')}</h3>
        <div className="booksContainer">
          {allCompilationsData ? (
            allCompilationsData.data?.map((book: BookInterface) => (
              <BookCard key={book._id} bookData={book} />
            ))
          ) : (
            <p>No compilations books are available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
