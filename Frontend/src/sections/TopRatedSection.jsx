
import React, { useRef } from 'react';
import styles from "./TopRatedSection.module.css";
import { RiArrowLeftWideLine, RiArrowRightWideFill } from "react-icons/ri";
import Product from '../components/user/Product';

const TopRatedSection = () => {
  const scrollRef = useRef(null);
  const scrollAmount = 200; // Customize based on card width

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
      // Loop to start
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: container.scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (container.scrollLeft - scrollAmount <= 0) {
      // Loop to end
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: container.scrollLeft - scrollAmount, behavior: 'smooth' });
    }
  };

  const products = [
    { name: "LED Smart Bulb", price: 299 },
    { name: "Ceiling Panel Light", price: 899 },
    { name: "Decorative Wall Light", price: 649 },
    { name: "Tube Light 36W", price: 450 },
    { name: "Spot Light Adjustable", price: 320 },
    { name: "Flood Light 100W", price: 1299 },
    { name: "Solar Garden Light", price: 799 },
    { name: "Chandelier 5 Arms", price: 2599 },
    { name: "Emergency Light", price: 559 },
    { name: "Pendant Hanging Light", price: 999 },
  ];  

  return (
    <div className={styles.main}>
      <div className={styles.sectionHeader}>
        <div className={styles.heading}>
          <RiArrowLeftWideLine size={22} className={styles.nextBtn} onClick={scrollLeft} />
          <p>Top Rated</p>
          <RiArrowRightWideFill size={22} className={styles.nextBtn} onClick={scrollRight} />
        </div>
        <p className={styles.viewAllBtn}>View all</p>
      </div>

      <div className={styles.productsContainer} ref={scrollRef}>
        {products.map((product, index) => (
          <Product key={index} name={product.name} price={product.price} productId={product._id}/>
        ))}
      </div>
    </div>
  );
};

export default TopRatedSection;
