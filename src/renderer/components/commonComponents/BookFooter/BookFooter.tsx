import React, { useEffect, useState } from 'react';
import { MinusLogo, PlusLogo } from '../../../../../assets/iconsCustom/Svgs';
import { Button, Col, Progress, Row, Tooltip } from 'antd';
import { NavItem } from 'epubjs';
import { useTranslation } from 'react-i18next';
import './BookFooter.css';

interface BookFooterProps {
  totalChapters: NavItem[];
  currentChapterIndex: string;
  onChapterChange: (chapter: string) => void;
  handleZoom: (zoomStyle: number) => void;
  progress: number;
  proceedNext: boolean;
  setProceedNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookFooter: React.FC<BookFooterProps> = ({
  handleZoom = () => {},
  currentChapterIndex,
  onChapterChange,
  totalChapters,
  progress,
  proceedNext,
  setProceedNext,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(2);
  const { t } = useTranslation();
  // const [wrongPageNumber, setWrongPageNumber] = useState<boolean>(false);

  const [chapterValue, setChapterValue] = useState<string>(currentChapterIndex);
  useEffect(() => {
    if (currentChapterIndex !== chapterValue)
      setChapterValue(currentChapterIndex);
  }, [currentChapterIndex]);
  const handleZoomIn = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    setZoomLevel(zoomLevel + 2);
    handleZoom(zoomLevel + 2);
  };

  const handleZoomOut = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    setZoomLevel(zoomLevel - 2);
    handleZoom(zoomLevel - 2);
  };

  // const handlePageNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const pageNumber = e.target.value;
  //   setChapterValue((e.target.valueAsNumber - 1).toString());
  //   if (parseInt(pageNumber) > totalChapters.length || Number(pageNumber) < 1) {
  //     setWrongPageNumber(true);
  //   } else {
  //     setWrongPageNumber(false);
  //     onChapterChange && onChapterChange(pageNumber);
  //   }
  // };

  return (
    <div className="BookFooter">
      <Row>
        <Col md={9} className="m-auto">
          <div className="progress">
            <div className="progValue">
              <div className="helpTe">
                {totalChapters?.length &&
                totalChapters[Number(currentChapterIndex)]?.label ? (
                  totalChapters[Number(currentChapterIndex)]?.label.length >
                  30 ? (
                    <Tooltip
                      title={totalChapters[Number(currentChapterIndex)]?.label
                        .toLocaleLowerCase()
                        .replace(/(^|\s)\S/g, (char) => char.toUpperCase())}
                      overlayClassName="pageNumberInfo"
                    >
                      {totalChapters[Number(currentChapterIndex)]?.label
                        .slice(0, 30)
                        .toLocaleLowerCase()
                        .replace(/(^|\s)\S/g, (char) => char.toUpperCase()) +
                        '...'}
                    </Tooltip>
                  ) : (
                    totalChapters[Number(currentChapterIndex)]?.label
                      .toLocaleLowerCase()
                      .replace(/(^|\s)\S/g, (char) => char.toUpperCase())
                  )
                ) : (
                  t('Your Progress')
                )}
                {/* // all the styling to transfer teh text from capital to lower case */}
              </div>
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
        <Col md={6} className="m-auto">
          <div className="buttonsContainer">
            <Button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 2 ? true : false}
              className="zoomButtons"
            >
              <MinusLogo width={'14'} />
            </Button>
            <span className="zoomValue">
              {Math.round((zoomLevel / 20) * 100)}%
            </span>
            <Button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 20 ? true : false}
              className="zoomButtons"
            >
              <PlusLogo width={'14'} />
            </Button>
          </div>
        </Col>
        <Col md={9} className="m-auto">
          <div className="booksNav">
            <Button
              className="prevSec"
              onClick={() => {
                onChapterChange((Number(currentChapterIndex) - 1).toString());
              }}
              disabled={Number(currentChapterIndex) - 1 <= -1}
            >
              {t('Previous Section')}
            </Button>
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
      </Row>
      {/* <div className="pageNumberHandler">
        <span>Chapters:</span>
        <div
          className="pageNumbers"
          style={{
            border: wrongPageNumber ? "1px solid red" : "none",
          }}
        >
          <input
            type="number"
            value={Number(chapterValue) + 1}
            onChange={handlePageNumber}
            className="currentPageNumber"
            min={1}
            max={totalChapters}
          />
          /{totalChapters}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button disabled={Number(currentChapterIndex) - 1 <= -1}>
          Previous Section
        </button>
        <div>{Math.floor(1 * 100)}%</div>
        <button disabled={Number(currentChapterIndex) + 1 > totalChapters - 1}>
          Next Section
        </button>
      </div> */}
    </div>
  );
};

export default BookFooter;
