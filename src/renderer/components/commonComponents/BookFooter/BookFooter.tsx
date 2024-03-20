import React, { useEffect, useState } from 'react';
import {
  CapitalWordLogo,
  FullScreenIcon,
} from '../../../../../assets/iconsCustom/Svgs';
import { Button, Col, Progress } from 'antd';
import { NavItem } from 'epubjs';
import { useTranslation } from 'react-i18next';
import './BookFooter.css';

interface BookFooterProps {
  totalChapters: NavItem[];
  currentChapterIndex: string;
  onChapterChange: (chapter: string) => void;
  progress: number;
  proceedNext: boolean;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookFooter: React.FC<BookFooterProps> = ({
  currentChapterIndex,
  onChapterChange,
  totalChapters,
  progress,
}) => {
  const { t } = useTranslation();

  const [chapterValue, setChapterValue] = useState<string>(currentChapterIndex);
  useEffect(() => {
    if (currentChapterIndex !== chapterValue)
      setChapterValue(currentChapterIndex);
  }, [currentChapterIndex]);

  return (
    <div className="BookFooter">
      <Col md={24} className="m-auto">
        <div className="booksFooterContainer">
          <Button
            className="prevSec"
            onClick={() => {
              onChapterChange((Number(currentChapterIndex) - 1).toString());
            }}
            disabled={Number(currentChapterIndex) - 1 <= -1}
          >
            {t('Previous Section')}
          </Button>
          <div className="vertical1Divider">
            <CapitalWordLogo width={'40'} />
            <div />

            <div className="vertical2Divider">
              <FullScreenIcon width={'40'} />
            </div>
          </div>
          <Button
            className="nextSec"
            onClick={() =>
              onChapterChange((Number(currentChapterIndex) + 1).toString())
            }
            disabled={
              Number(currentChapterIndex) + 1 > totalChapters?.length - 1
            }
          >
            {t('Next Section')}
          </Button>
        </div>
      </Col>

      <Col md={24} className="m-auto">
        <div className="progress">
          <div className="yourProgressHeading">
            {t('Your Progress')}

            <div className="value">
              {progress + '%'} {t('Completed')}
            </div>
          </div>
          <Progress
            percent={progress}
            status="active"
            className="bookProgress"
          />
        </div>
      </Col>
    </div>
  );
};

export default BookFooter;
