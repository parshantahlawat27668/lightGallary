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

        <div className={styles.slide} style={{ backgroundColor: "red" }}>
          <img src='https://images.unsplash.com/photo-1475783006851-1d68dd683eff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className={styles.themeImage}></img>
          <div className={styles.slideInfo}>
            <p className={styles.heading}>Indoor Lights</p>
            <p className={styles.subHeading}>Brighten Every Corner of Your Home</p>
          </div>
        </div>
        <div className={styles.slide} style={{ backgroundColor: "purple" }}>
          <img src='https://images.unsplash.com/photo-1697299658526-5d15ddc6ddc7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className={styles.themeImage}></img>
          <div className={styles.slideInfo} style={{color:"rgba(255, 255, 255, 0.767)"}}>
            <p className={styles.heading}>Outdoor Lights</p>
            <p className={styles.subHeading}>Transform Your Outdoors After Sunset</p>
          </div>
        </div>
        <div className={styles.slide} style={{ backgroundColor: "blue" }}>
          <img src='https://images.unsplash.com/photo-1606170033648-5d55a3edf314?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className={styles.themeImage}></img>
          <div className={styles.slideInfo}>
            <p className={styles.heading}>Decorative Lights</p>
            <p className={styles.subHeading}>From Ordinary to Wow – Light the Difference</p>
          </div>
        </div>
        <div className={styles.slide} style={{ backgroundColor: "green" }}>
          <img src='https://plus.unsplash.com/premium_photo-1728681169090-f513a665d08f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' className={styles.themeImage}></img>
          <div className={styles.slideInfo}>
            <p className={styles.heading}>Smart Lights</p>
            <p className={styles.subHeading}>Smarter Illumination for Smarter Living</p>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default ThemesSection;
