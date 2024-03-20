import React, { useState } from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateBookReadCount } from '../../../utils/api';
import defaultCover from '../../../../../assets/BookCardDefaultPic.svg';
import { StarFilledLogo } from '../../../../../assets/iconsCustom/Svgs';
import { BookInterface, bookReadCounts } from '../../../utils/interfaces';
import { StarOutlined, MoreOutlined } from '@ant-design/icons';
import { sidebarChange } from '../../../redux/search/SearchBooksSlice';
import useComponentVisible from '../../../utils/useComponentVisible';
import SummaryBookModal from '../../commonComponents/SummaryModal/SummaryBookModal';
import './BookCard.css';

const { Meta } = Card;

interface BookCardProps {
  bookData: BookInterface;
}

const BookCard: React.FC<BookCardProps> = ({ bookData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentBookReadCount, setCurrentBookReadCount] = useState<number>(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [starSelected, setStarSelected] = useState(false);
  const [compilationBookClicked, setCompilationBookClicked] =
    useState<boolean>(false);
  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setIsComponentVisible(!isComponentVisible);
  };

  const handleMenuItemClick = (action: string) => {
    setMenuVisible(false);
    setIsComponentVisible(false);
    if (action === 'Summary') {
      setShowSummaryModal(true);
    } else {
      bookReadNavigation();
    }
  };

  const bookReadNavigation = () => {
    let oldBookCounts: bookReadCounts =
      JSON.parse(localStorage.getItem('bookReadCounts') ?? '{}') ?? {};
    if (!oldBookCounts[bookData._id as string]) {
      oldBookCounts[bookData._id as string] = true;
      localStorage.setItem('bookReadCounts', JSON.stringify(oldBookCounts));
      bookData._id && updateBookReadCount(bookData._id);
      setCurrentBookReadCount(currentBookReadCount + 1);
    }
    if (compilationBookClicked) {
      console.log('cliekded compilation book', compilationBookClicked);
      navigate(
        `/book/${bookData._id}?compilation=${compilationBookClicked}&bookId=${bookData._id}`,
      );
    } else {
      console.log('not ', compilationBookClicked);
      navigate(`/book/${bookData._id}?compilation=${compilationBookClicked}`);
    }
    dispatch(sidebarChange());
  };
  const toggleStar = () => {
    setStarSelected(!starSelected);
  };

  return (
    <>
      <Card
        className="bookCard"
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img
              alt="default"
              src={bookData.thumbnailLink || defaultCover}
              style={{ width: '100%' }}
            />
            <div className="topLeftIcon">
              <StarFilledLogo />
            </div>
            <div className="topRightIcon" ref={ref}>
              <div className="dropdown">
                <MoreOutlined onClick={toggleMenu} />
                {isComponentVisible && (
                  <div className="dropdownMenu">
                    <button onClick={() => handleMenuItemClick('Summary')}>
                      {t('Summary')}
                    </button>
                    <button onClick={() => handleMenuItemClick('Read Now')}>
                      {t('Read Now')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        <Meta title={bookData.bookName} description={bookData.authorName} />
      </Card>
      {showSummaryModal && (
        <SummaryBookModal
          bookData={bookData}
          showModal={true}
          setShowSummaryModal={setShowSummaryModal}
          compilationBookClicked={compilationBookClicked}
        />
      )}
    </>
  );
};

export default BookCard;
