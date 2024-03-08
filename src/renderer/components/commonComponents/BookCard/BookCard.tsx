import React from 'react';
import { Card, Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import defaultCover from '../../../../../assets/BookCardDefaultPic.svg';
import { BookInterface } from '../../../utils/interfaces';
import { StarOutlined, MoreOutlined } from '@ant-design/icons';
import './BookCard.css';

const { Meta } = Card;

interface BookCardProps {
  bookData: BookInterface;
}

const BookCard: React.FC<BookCardProps> = ({ bookData }) => {
  const { t } = useTranslation();
  const menu = (
    <Menu className="cardMoreDropdown">
      <Menu.Item key="1">Summary</Menu.Item>
      <Menu.Item key="2">Read Now</Menu.Item>
    </Menu>
  );
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
          <div className="topRightIcon">
            <Dropdown overlay={menu} trigger={['click']}>
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
      }
    >
      <Meta title={t('The Consciousness')} description={bookData.authorName} />
    </Card>
  );
};

export default BookCard;
