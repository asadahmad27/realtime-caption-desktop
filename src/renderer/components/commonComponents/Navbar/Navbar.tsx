import React, { useState, useRef } from 'react';
import { Layout, Input, Button, Dropdown, Tooltip, Menu } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDown } from 'react-icons/ai';
import { RootState } from '../../../redux/store';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from 'react-icons/io5';
import { IoChevronDownOutline } from 'react-icons/io5';
import type { MenuProps } from 'antd';
import {
  EnglishLanguage,
  FrenchLanguage,
  HelpQuestionMark,
  HamBurgerIcon,
  HomeIcon,
  Logo,
} from '../../../../../assets/iconsCustom/Svgs';
import AABBooksButton from '../AabBookButton/AABBooksButton';
import BookList from '../../BooksList/BooksList';
import './Navbar.css';
import BookCard from '../BookCard/BookCard';
import Home from '../../Home/Home';

const { Header } = Layout;
const items: MenuProps['items'] = [
  {
    label: 'English',
    key: '1',
    icon: <EnglishLanguage />,
  },
  {
    label: 'French',
    key: '2',
    icon: <FrenchLanguage />,
  },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    language === 'fr' ? 'French' : 'English',
  );
  const selectedBooksForSearch = useSelector(
    (state: RootState) => state.booksData,
  );
  const { searchText: searchingText } = useParams();
  const [inputFocused, setInputFocused] = useState<boolean>(
    searchingText ? true : false,
  );
  const [visible, setVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [noBooksSelected, setNoBooksSelected] = useState<boolean>(false);
  const [emptySearch, setEmptySearch] = useState<boolean>(false);
  const openDropDown = useRef<HTMLDivElement>(null);
  const [selectedBooks, setSelectedBooks] = useState<CheckboxValueType[]>([]);
  const [searchParams] = useSearchParams();
  const [dropDownClicked, setDropDownClicked] = useState<boolean>(false);
  const compilationActive = searchParams.get('compilation');
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>(
    searchingText ? searchingText : '',
  );
  const searchTextInBooks = (
    searchValue: string,
    compilation: boolean,
  ): void => {
    const encodedSearchValue = encodeURIComponent(searchValue);
    if (compilation) {
    }
    setDropDownClicked(false);
  };
  const handleDropdownVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible);
  };
  const handleSearchButton = (): void => {
    if (searchText.trim().length > 2) {
      if (compilationActive === 'true') {
        searchTextInBooks(searchText, true);
      } else {
        if (selectedBooks.length) {
          searchTextInBooks(searchText, false);
        } else {
          setNoBooksSelected(true);
        }
      }
    } else {
      setEmptySearch(true);
    }
  };
  const checkForClick = (e: MouseEvent) => {
    const isClickedInside = openDropDown.current?.contains(e.target as Node);

    if (!isClickedInside) {
      setDropDownClicked(false);
      removeEventListener();
    }
  };

  const closeBooksDropDown = () => {
    document.addEventListener('click', checkForClick);
  };
  const handleInputFocus = () => {
    setInputFocused(true);
  };
  const removeEventListener = () => {
    document.removeEventListener('click', checkForClick);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '1') {
      i18n.changeLanguage('en');
      localStorage.setItem('language', 'en');
      setSelectedLanguage('English');
    } else {
      i18n.changeLanguage('fr');
      localStorage.setItem('language', 'fr');
      setSelectedLanguage('French');
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
    selectable: true,
    defaultSelectedKeys: language === 'fr' ? ['2'] : ['1'],
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.currentTarget.value.length && setEmptySearch(false);
    if (e.key === 'Enter') {
      if (e.currentTarget.value) {
        if (compilationActive === 'true') {
          searchTextInBooks(e.currentTarget.value, true);
        } else {
          if (selectedBooks.length || selectedBooksForSearch.books.length) {
            searchTextInBooks(e.currentTarget.value, false);
          } else {
            setNoBooksSelected(true);
          }
        }
      } else {
        setEmptySearch(true);
      }
    }
  };
  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleHamBurgerIconClick = (e: any) => {
    if (e.key === 'menu') {
      setVisible(!visible);
    }
  };
  const handleLogout = () => {};

  const menu = (
    <Menu onClick={handleHamBurgerIconClick}>
      <Menu.Item key="1" onClick={() => navigate('./')}>
        {t('Home')}
      </Menu.Item>
      <Menu.Item key="2" onClick={() => navigate('./annotations')}>
        {t('Annotations')}
      </Menu.Item>
      <Menu.Item key="3" onClick={() => navigate('./help')}>
        {t('Help')}
      </Menu.Item>
      <Menu.Item key="4" onClick={() => navigate('./about')}>
        {t('About')}
      </Menu.Item>
      <Menu.Item key="5" onClick={handleLogout}>
        {t('Logout')}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Header className="navbar">
        <div className="logoContainer">
          <span onClick={() => navigate('/')}>
            <Logo />
          </span>
        </div>
        <div className={`search-bar ${inputFocused ? 'focusedSearch' : ''}`}>
          <div
            className={`inputContainer  ${
              compilationActive === 'true' && inputFocused && 'flexRowDirection'
            } `}
          >
            <Input
              className={`nav-input ${
                emptySearch ? 'erroredDiv' : 'normalBorder'
              } ${
                compilationActive === 'true' && inputFocused && 'customWidth'
              } `}
              placeholder={t('Search word or phrase')}
              prefix={
                <IoSearchOutline
                  style={{ color: '#888', height: '21px', width: '21px' }}
                  className="booksSearchIcon"
                />
              }
              onFocus={handleInputFocus}
              onKeyDown={handleSearch}
              onChange={handleSearchText}
              value={searchText}
            />
            {emptySearch && (
              <span className="emptySearch">
                {t('Please enter a search term')}
              </span>
            )}
          </div>
          {compilationActive !== 'true' && (
            <div
              className={`booksContainer ${
                inputFocused ? 'showBooksButton' : 'hideBooksButton'
              }`}
            >
              <Button
                className={`booksButton  ${
                  noBooksSelected ? 'erroredDiv' : 'normalBorderForBookOptions'
                } `}
                onClick={() => {
                  if (!dropDownClicked) {
                    setTimeout(() => {
                      closeBooksDropDown();
                    }, 0);
                  } else {
                    removeEventListener();
                  }
                  setDropDownClicked(!dropDownClicked);
                }}
              >
                {t('Search Options')}
                <AiOutlineDown
                  className={`booksIcon ${
                    dropDownClicked ? ' iconClicked' : ''
                  }`}
                />
              </Button>
              {noBooksSelected && (
                <span className="emptySearch">
                  {t('Please select at least one book')}
                </span>
              )}
            </div>
          )}

          {inputFocused && (
            <AABBooksButton
              label={t('Search')}
              name="search"
              height="50px"
              borderRadius="6px"
              onClick={handleSearchButton}
              //   className="bookSearchButton"
            />
          )}
          <div className="languagesOption">
            <Dropdown
              menu={menuProps}
              trigger={['click']}
              open={dropdownVisible}
              onOpenChange={handleDropdownVisibleChange}
            >
              <Button className="languageButton">
                {selectedLanguage === 'English' ? (
                  <EnglishLanguage />
                ) : (
                  <FrenchLanguage />
                )}

                {selectedLanguage}
                <span
                  className={dropdownVisible ? 'reverted normal' : 'normal'}
                >
                  <IoChevronDownOutline />
                </span>
              </Button>
            </Dropdown>
          </div>

          <Dropdown
            overlay={menu}
            trigger={['click']}
            visible={visible}
            onVisibleChange={setVisible}
          >
            <div className="help">
              <HamBurgerIcon />
            </div>
          </Dropdown>
        </div>
      </Header>
      <span ref={openDropDown}>
        <BookList
          dropDownClicked={dropDownClicked}
          setSelectedBooks={setSelectedBooks}
          setNoBooksSelected={setNoBooksSelected}
        />
      </span>
    </>
  );
};

export default Navbar;
