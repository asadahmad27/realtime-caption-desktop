import { Col, Row, Button, Spin, Tooltip } from 'antd';
import { BookFooter, Sidebar } from '../commonComponents';
import { BookContainer, PrimaryLayout } from '../../components/functional';
import { useEffect, useState } from 'react';
import { BookInterface, bookInfo } from '../../utils/interfaces';
import { LeftArrow } from '../../../../assets/iconsCustom/Svgs';
import { useParams, useSearchParams } from 'react-router-dom';
import { NavItem } from 'epubjs';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { getAllBookData } from '../../utils/functions';
import { useTranslation } from 'react-i18next';
import './BookView.css';

const BookView: React.FC = () => {
  const [collapseIcon, setCollapseIcon] = useState<boolean>(false);
  const [collapsableSidebar, setCollapsableSidebar] = useState<boolean>(false);
  const [AllBooks, setAllBooks] = useState<BookInterface[]>([]);
  const [currentBookAndChapter, setCurrentBookAndChapter] = useState<bookInfo>({
    book: '',
    chapter: '',
  });
  const [disableFroward, setDisableFroward] = useState<boolean>(false);
  const [disableBackward, setDisableBackward] = useState<boolean>(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<string>('0');
  const [parentRendition, setParentRendition] = useState<any>(null);
  const [currentCfi, setCurrentCfi] = useState<string>('');
  const [allBooksChapters, setAllBooksChapters] = useState<NavItem[][]>([]);
  const [proceedNext, setProceedNext] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [key, setKey] = useState<number>(0);
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const compilationActive = searchParams.get('compilation');
  const allBooksData: { data: BookInterface[] } = getAllBookData(
    compilationActive === 'true' ? true : false,
  );
  const currentBookIndex = currentBookAndChapter?.book
    ? AllBooks.findIndex(
        (book) => book.bookLink === currentBookAndChapter.book.split('=>')[0],
      )
    : 0;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // For smooth scrolling, use 'auto' for instant scrolling
    });
    if (allBooksData && allBooksData?.data?.length) {
      getAllBooks();
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [allBooksData]);

  function getAllBooks() {
    const currentBook: BookInterface = allBooksData?.data?.find(
      (book: BookInterface) => book._id === id,
    ) as BookInterface;

    setCurrentBookAndChapter((old) => ({
      book: currentBook?.bookLink || '',
      chapter: old.chapter ? old.chapter : 'Text/cover.xhtml',
    }));
    if (compilationActive === 'true') {
      const currentBookData = allBooksData?.data?.filter(
        (book: BookInterface) => book._id === id,
      );
      setAllBooks(currentBookData || []);
    } else {
      setAllBooks(allBooksData?.data || []);
    }
  }
  const handleWindowResize = () => {
    setKey(Math.floor(Math.random() * 100) + 1);

    setParentRendition(null);
  };

  const browserBack = () => {
    window.history.back();
  };

  const handleZoom = (zoomValue: number) => {
    if (parentRendition) {
      parentRendition.themes.default({
        p: { 'font-size': `${zoomValue + 16}px !important` },
      });

      currentCfi && parentRendition.display(currentCfi);
    }
  };

  const onChapterChange = (chapter: string) => {
    if (!proceedNext) return;
    setProceedNext(false);

    const newChapter = allBooksChapters[currentBookIndex][Number(chapter)];
    let newChapterHref = newChapter.href;
    let newBook = '';
    if (newChapter.subitems?.length) {
      const currentBook = AllBooks.find(
        (book) => book.bookLink === currentBookAndChapter.book.split('=>')[0],
      );

      newChapterHref =
        newChapter.href +
        '___' +
        currentBook?.bookName +
        '_children_' +
        currentBook?.bookLink;
      newBook = currentBook?.bookLink + '=>' + newChapterHref;
    }
    parentRendition.display(Number(chapter));
    setCurrentChapterIndex(chapter);
    setCurrentBookAndChapter((old) => ({
      book: newBook.length ? newBook : old.book,
      chapter: newChapterHref || '',
    }));
  };
  const handleBackward = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    !disableBackward && parentRendition?.prev();
  };

  const handleForward = () => {
    if (!proceedNext) return;
    setProceedNext(false);
    !disableFroward && parentRendition?.next();
  };
  return (
    <PrimaryLayout key={key}>
      <Row className="mainContainer">
        <Col md={collapsableSidebar ? 0 : 5}>
          <Sidebar
            AllBooks={AllBooks}
            setCurrentBookAndChapter={setCurrentBookAndChapter}
            currentBookAndChapter={currentBookAndChapter}
            openKeys={openKeys}
            setOpenKeys={setOpenKeys}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            setProceedNext={setProceedNext}
            proceedNext={proceedNext}
            setAllBooksChapters={setAllBooksChapters}
            collapseIcon={collapseIcon}
            collapsableSidebar={collapsableSidebar}
          />
        </Col>
        <Col
          md={collapsableSidebar ? 24 : 19}
          style={{ background: ' #ebeef4' }}
        >
          <div
            onMouseEnter={() => setCollapseIcon(true)}
            onClick={() => {
              setCollapsableSidebar(!collapsableSidebar);
              setKey(Math.floor(Math.random() * 100) + 1);
              setCollapseIcon(false);
            }}
            onMouseLeave={() => setCollapseIcon(false)}
            className="collapseIcon"
          >
            {collapsableSidebar ? (
              <Tooltip
                placement="right"
                overlayClassName="pageNumberInfo"
                title={t('Expand Sidebar')}
              >
                <div className="sectionCollapse">
                  {' '}
                  <GrNext />{' '}
                </div>
              </Tooltip>
            ) : (
              <Tooltip
                title={t('Collapse Sidebar')}
                placement="right"
                overlayClassName="pageNumberInfo"
              >
                <div className="sectionCollapse">
                  <GrPrevious />
                </div>
              </Tooltip>
            )}
          </div>
          <Spin
            spinning={!proceedNext}
            delay={300}
            className={'bookParentSpin'}
          >
            <Row>
              <Col md={collapsableSidebar ? 2 : 3}>
                <div className="browserBack bookReadBack" onClick={browserBack}>
                  <LeftArrow />
                  <span>{t('Back')}</span>
                </div>
                <div className={`previousPage`}>
                  <Button onClick={handleBackward} disabled={disableBackward}>
                    <GrPrevious />
                  </Button>
                </div>
              </Col>
              <Col md={collapsableSidebar ? 20 : 18}>
                <div className="bookContainer">
                  <BookContainer
                    currentBookAndChapter={currentBookAndChapter}
                    setCurrentChapterIndex={setCurrentChapterIndex}
                    parentRendition={parentRendition}
                    setParentRendition={setParentRendition}
                    totalChapters={allBooksChapters[currentBookIndex]}
                    setProgress={setProgress}
                    setDisableForward={setDisableFroward}
                    setDisableBackward={setDisableBackward}
                    setOpenKeys={setOpenKeys}
                    setSelectedKeys={setSelectedKeys}
                    setProceedNext={setProceedNext}
                    setCurrentCfi={setCurrentCfi}
                  />
                </div>
              </Col>
              <Col md={collapsableSidebar ? 2 : 3}>
                <div className={`nextPage `}>
                  <Button onClick={handleForward} disabled={disableFroward}>
                    <GrNext />
                  </Button>
                </div>
              </Col>
            </Row>
          </Spin>
          <Row className="footerRow">
            <Col md={2}></Col>
            <Col md={20}>
              <BookFooter
                totalChapters={allBooksChapters[currentBookIndex]}
                currentChapterIndex={currentChapterIndex}
                handleZoom={handleZoom}
                onChapterChange={onChapterChange}
                progress={progress}
                proceedNext={proceedNext}
                setProceedNext={setProceedNext}
              />
            </Col>
            <Col md={2}></Col>
          </Row>
        </Col>
      </Row>
    </PrimaryLayout>
  );
};

export default BookView;
