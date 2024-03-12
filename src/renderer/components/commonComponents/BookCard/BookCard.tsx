import React, { useState } from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import defaultCover from '../../../../../assets/BookCardDefaultPic.svg';
import { BookInterface } from '../../../utils/interfaces';
import { StarOutlined, MoreOutlined } from '@ant-design/icons';
import './BookCard.css';
import useComponentVisible from '../../../utils/useComponentVisible';

const { Meta } = Card;

interface BookCardProps {
  bookData: BookInterface;
}

const BookCard: React.FC<BookCardProps> = ({ bookData }) => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  const [ref, isComponentVisible, setIsComponentVisible] =
    useComponentVisible(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setIsComponentVisible(!isComponentVisible);
  };

  const handleMenuItemClick = (action: string) => {
    console.log(action);
    setMenuVisible(false);
    setIsComponentVisible(false);
  };

  return (
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
            <StarOutlined />
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
      <Meta title={t('The Consciousness')} description={bookData.authorName} />
    </Card>
  );
};

export default BookCard;
