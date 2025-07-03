import React, { useState } from 'react';
import styles from "./ThemesSection.module.css";
import { RiArrowLeftWideLine, RiArrowRightWideFill } from 'react-icons/ri';

const ThemesSection = () => {
  const [index, setIndex] = useState(0);
  const totalSlides = 4;

  const nextSlide = () => {
    setIndex(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className={styles.main}>
      <RiArrowLeftWideLine size={28} className={styles.leftArrow} onClick={prevSlide} />
      <RiArrowRightWideFill size={28} className={styles.rightArrow} onClick={nextSlide} />
      
      <div className={styles.slideContainer} style={{ transform: `translateX(-${index * 100}vw)` }}>
        <div className={styles.slide} style={{ backgroundColor: "red" }}>one</div>
        <div className={styles.slide} style={{ backgroundColor: "purple" }}>two</div>
        <div className={styles.slide} style={{ backgroundColor: "blue" }}>three</div>
        <div className={styles.slide} style={{ backgroundColor: "green" }}>four</div>
      </div>
    </div>
  );
};

export default ThemesSection;
