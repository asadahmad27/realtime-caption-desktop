import React, { useEffect, useState } from 'react';
import { Checkbox, Button, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { BookInterface } from '../../utils/interfaces';
import { useGetAllBooksDataQuery } from '../../redux/booksData/BooksData';
import { useTranslation } from 'react-i18next';
import './BooksList.css';

interface BooksListProps {
  dropDownClicked: boolean;
  setSelectedBooks: React.Dispatch<React.SetStateAction<CheckboxValueType[]>>;
  setNoBooksSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const BooksList: React.FC<BooksListProps> = ({
  dropDownClicked,
  setSelectedBooks,
  setNoBooksSelected,
}) => {
  const { t } = useTranslation();
  const [allBooks, setAllBooks] = useState<BookInterface[]>([]);
  const selectedBooksForSearch = useSelector(
    (state: RootState) => state.booksData,
  );
  const [booksChoosed, setBooksChoosed] = useState<CheckboxValueType[]>([]);
  const [allBooksSelected, setAllBooksSelected] = useState<boolean>(false);

  const { data: allBooksResponse } = useGetAllBooksDataQuery('English');
  function getAllBooks() {
    setAllBooks(allBooksResponse?.data || []);
  }

  useEffect(() => {
    getAllBooks();
  }, [allBooksResponse]);
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setSelectedBooks(checkedValues);
    setBooksChoosed(checkedValues);

    if (checkedValues.length === allBooks.length) {
      setAllBooksSelected(true);
    } else {
      setAllBooksSelected(false);
    }
    if (checkedValues.length) {
      setNoBooksSelected(false);
    }
  };

  const resetBooks = (): void => {
    setSelectedBooks([]);
    setBooksChoosed([]);
    setAllBooksSelected(false);
  };
  const selectAllBooks = (): void => {
    setSelectedBooks([
      ...new Set(allBooks.map((book: BookInterface) => book.bookLink)),
    ] as CheckboxValueType[]);
    setBooksChoosed([
      ...new Set(allBooks.map((book: BookInterface) => book.bookLink)),
    ] as CheckboxValueType[]);
    setAllBooksSelected(true);
    setNoBooksSelected(false);
  };

  useEffect(() => {
    if (selectedBooksForSearch.books.length) {
      setBooksChoosed(selectedBooksForSearch.books);
      setSelectedBooks(selectedBooksForSearch.books);
      setNoBooksSelected(false);
    }
  }, [selectedBooksForSearch]);

  return (
    <div
      className={`bookList ${
        dropDownClicked ? 'bookListShow' : 'bookListHide'
      }`}
    >
      <div className="searchMode">
        <div className="selectDiv">
          <p className="selectBooks"> {t('Search by')}</p>
        </div>
        <div className="books">
          <Checkbox.Group
            style={{ width: '100%' }}
            // onChange={onChangeSearchMode}
            defaultValue={['exactWords']}
          >
            <Row>
              <Col md={6} className="singleBookName">
                <Checkbox value={'exactWords'} className="exactWords">
                  {t('Exact Match')}
                </Checkbox>
              </Col>
              <Col className="singleBookName">
                <Checkbox value={'similarWords'} disabled>
                  {t('Approximate Match')}
                </Checkbox>{' '}
                <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                  ({t('Premium')})
                </span>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      <div className="booksToSelect">
        <div className="selectDiv">
          <p className="selectBooks">{t('Select Books')}</p>
          <Button
            type="link"
            className="unselectAll"
            onClick={allBooksSelected ? resetBooks : selectAllBooks}
          >
            {allBooksSelected ? t('UnSelect All') : t('Select All')}
          </Button>
        </div>
        <div className="books">
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={onChange}
            value={booksChoosed}
          >
            <Row className="booksOptionsContainer">
              {allBooks.map((book: BookInterface, index: number) => (
                <Col md={6} className="singleBookName" key={index}>
                  <Checkbox value={book.bookLink}>
                    {book.bookName || 'No Name'}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};

export default BooksList;
