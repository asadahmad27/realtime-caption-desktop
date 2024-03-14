import React, { useEffect, useState } from 'react';
import { Modal, Button, Image, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Cart } from '../../../../../assets/iconsCustom/Svgs';
import { BookInterface, bookReadCounts } from '../../../utils/interfaces';
import { getBookReadCount, updateBookReadCount } from '../../../utils/api';
import defaultCover from '../../../../../assets/BookCardDefaultPic.svg';
import { sidebarChange } from '../../../redux/search/SearchBooksSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './SummaryBookModal.css';

interface SummaryBookModalProps {
  showModal: boolean;
  bookData: BookInterface;
  setShowSummaryModal: any;
  compilationBookClicked?: boolean;
}

const SummaryBookModal: React.FC<SummaryBookModalProps> = ({
  showModal,
  setShowSummaryModal,
  bookData,
  compilationBookClicked,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [currentBookReadCount, setCurrentBookReadCount] = useState<number>(0);
  const closeModal = () => {
    // setShowModal(false);
    dispatch(sidebarChange());
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (bookData?._id) {
      getBookCounts();
    }
  }, [bookData]);

  useEffect(() => {
    console.log('ddddddddd', bookData);
  }, [bookData]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const getBookCounts = async () => {
    const userCounts = await getBookReadCount(bookData._id as string);
    setCurrentBookReadCount(userCounts?.data?.Total_users ?? 0);
  };
  const bookReadNavigation = () => {
    console.log('helo');
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

  return (
    <Modal
      visible={showModal}
      onCancel={() => setShowSummaryModal(false)}
      footer={null}
    >
      <div className="previewContainer">
        <div className="imageContainer">
          <Image
            width={'100%'}
            height={'100%'}
            src={bookData.thumbnailLink ? bookData.thumbnailLink : defaultCover}
          />
        </div>
        <div className="meta">
          <p className="bookTitle">{bookData.bookName}</p>
          <p className="author">
            {t('By')} {bookData.authorName}
          </p>
        </div>
        <div className="PreviewDescription">
          <p className="desc">
            {bookData?.bookDescription &&
            bookData?.bookDescription?.length > 300 ? (
              <>
                {showFullDescription ? (
                  <>
                    {bookData.bookDescription}
                    <span
                      onClick={toggleDescription}
                      className="showInstruction"
                    >
                      {' '}
                      &nbsp; {t('Read less')}
                    </span>
                  </>
                ) : (
                  <>
                    {bookData.bookDescription.slice(0, 300)}... &nbsp;
                    <span
                      onClick={toggleDescription}
                      className="showInstruction"
                    >
                      {t('Read more')}
                    </span>
                  </>
                )}
              </>
            ) : (
              bookData.bookDescription
            )}
          </p>
          {/* <p className="desc">{bookData.bookLanguage}</p> */}
        </div>
        <div className="info">
          <Row>
            <Col md={8} className="infoColumn">
              <p className="bookSmallInfo">
                {bookData.bookPage ? bookData.bookPage : 0}
              </p>
              <p className="bookSmallInfo">Pages</p>
            </Col>
            <Col md={8} className="infoColumn">
              <p className="bookSmallInfo">{currentBookReadCount}</p>
              <p className="bookSmallInfo">{t('Readers')}</p>
            </Col>
          </Row>
        </div>

        <div className="previewButtonContainer">
          <Button size="large" className="readNow" onClick={bookReadNavigation}>
            {t('Read Now')}
            <BookOpen />
          </Button>
          <br />
        </div>
      </div>
    </Modal>
  );
};

export default SummaryBookModal;
