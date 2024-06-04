import React, {useState, useEffect, useRef} from "react";
import "./ReviewsSlider.modul.scss";
import Swiper from 'swiper';

export const ReviewsSlider =({ reviews }) => {
    const reviewSliderRef = useRef(null);

    useEffect(() => {
      const swiper = new Swiper(reviewSliderRef.current, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
          el: '.reviews-pagination',
          clickable: true,
        },
      });
    }, []);
  
    return (
      <div className="reviews-slider" ref={reviewSliderRef}>
        {reviews.map((review) => (
          <div className="review" key={review.id}>
            <p className="author">{review.author}</p>
            <p className="text">{review.text}</p>
          </div>
        ))}
        <div className="reviews-pagination"></div>
      </div>
    );
  }
