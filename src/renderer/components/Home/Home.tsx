import { Navbar } from '../commonComponents';
import BookCard from '../commonComponents/BookCard/BookCard';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const books = Array.from({ length: 12 }, (_, index) => ({
    id: index,
  }));

  return (
    <>
      <Navbar />
      <div className={`dashboardContent`}>
        <h3 className="booksHeading">{t('Books')}</h3>
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
