
import React, { useRef } from 'react';
import styles from "./NewArrivalSection.module.css";
import { RiArrowLeftWideLine, RiArrowRightWideFill } from "react-icons/ri";
import Product from '../components/user/Product';
import { useSelector } from 'react-redux';
import { selectNewArrivals } from '../store/selectors/productsSelectors';

const NewArrivalSection = () => {
  const newArrivalProducts = useSelector((state)=>selectNewArrivals(state,10));
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


  const user = useSelector((state)=>state.user.activeUser);
  const wishlist = user?.wishList?.map((id) => id.toString()) || [];
  const wishlistSet = new Set(wishlist);
  const isWishListed = (productId) => wishlistSet.has(productId.toString());

  return (
    <div className={styles.main}>
      <div className={styles.sectionHeader}>
        <div className={styles.heading}>
          <RiArrowLeftWideLine size={22} className={styles.nextBtn} onClick={scrollLeft} />
          <p>New Arrivals</p>
          <RiArrowRightWideFill size={22} className={styles.nextBtn} onClick={scrollRight} />
        </div>
        <p className={styles.viewAllBtn}>View all</p>
      </div>

      <div className={styles.productsContainer} ref={scrollRef}>
        {newArrivalProducts.map((product, index) => (
          <Product key={index} product={product} wishListed={isWishListed(product._id)}/>
        ))}
      </div>  
    </div>
  );
};

export default NewArrivalSection;
