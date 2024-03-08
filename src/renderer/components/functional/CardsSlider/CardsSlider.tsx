import React, { ReactNode, useEffect, useRef } from 'react';
import { BookCard } from '../../commonComponents';
import { LeftCarrotArrow } from '../../../../../assets/iconsCustom/Svgs';
import { BookInterface } from '../../../utils/interfaces';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CardsSlider.css';

interface BooksCardCarouselProps {
  allBooks: BookInterface[];
  handleShowDrawer: (bookData: BookInterface, compilations?: boolean) => void;
  compilations?: boolean;
  showDrawer: boolean;
}
const CardsSlider: React.FC<BooksCardCarouselProps> = ({
  allBooks,
  handleShowDrawer,
  compilations,
  showDrawer,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (carouselRef.current) {
      // Add the class initially

      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.classList.add('carouselContainerFlex');
        }
      }, 1100);
    }

    if (sliderRef && sliderRef?.current) {
      setTimeout(() => {
        if (sliderRef && sliderRef?.current) {
          sliderRef.current.slickGoTo(0);
        }
      }, 1000);
    }
  }, [sliderRef.current, carouselRef.current]);

  const NextArrow: React.FC<{ onClick: (event: React.MouseEvent) => void }> = ({
    onClick,
  }) => (
    <div className="custom-arrow next rightArrow" onClick={onClick}>
      <LeftCarrotArrow />
    </div>
  );

  const PrevArrow: React.FC<{ onClick: (event: React.MouseEvent) => void }> = ({
    onClick,
  }) => (
    <div className="custom-arrow prev leftArrow" onClick={onClick}>
      <LeftCarrotArrow />
    </div>
  );
  const settings = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1640,
        settings: {
          slidesToShow: showDrawer ? 4 : 5,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: showDrawer ? 3 : 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1130,
        settings: {
          slidesToShow: showDrawer ? 2 : 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: showDrawer ? 1 : 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <NextArrow onClick={() => false} />, // Custom next arrow component
    prevArrow: <PrevArrow onClick={() => false} />, // Custom prev arrow component
    appendDots: (dots: ReactNode) => (
      <div className="custom-dots-container">{dots}</div>
    ),
    dots: true,
  };

  return (
    <div ref={carouselRef} className="customDiv">
      <Slider
        className="carouselContainer"
        {...settings}
        ref={sliderRef}

        // variableWidth
      >
        {allBooks?.map((singleBook, index) => {
          return (
            <div
              onClick={() =>
                handleShowDrawer(
                  singleBook,
                  compilations ? compilations : false,
                )
              }
              key={index}
              id={`bookCard${index}`}
            >
              <BookCard bookData={singleBook} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default CardsSlider;
