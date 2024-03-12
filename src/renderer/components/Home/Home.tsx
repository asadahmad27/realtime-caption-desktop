import { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../commonComponents';
import BookCard from '../commonComponents/BookCard/BookCard';
import { SortIcon } from '../../../../assets/iconsCustom/Svgs';
import useComponentVisible from '../../utils/useComponentVisible';
import './Home.css';

const { Item } = Menu;

const Home = () => {
  const { t } = useTranslation();

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

  return (
    <>
      <Navbar />
      <div className={`dashboardContent`}>
        <div className="booksHeadingContainer">
          <h3 className="booksHeading">{t('Books')}</h3>
          <div className="sortDiv">
            <div className="dropdown">
              <button className="dropdownToggle" onClick={toggleDropdown}>
                {t('Sort by:')}{' '}
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
          {books.map((book) => (
            <BookCard key={book.id} bookData={book} />
          ))}
        </div>

        <h3 className="compilationsHeading">{t('Compilations')}</h3>
        <div className="booksContainer">
          {books.map((book) => (
            <BookCard key={book.id} bookData={book} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
