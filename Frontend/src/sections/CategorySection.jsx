import React from 'react'
import styles from "./CategorySection.module.css"
import CategoryCard from '../components/user/CategoryCard'
import { RiArrowLeftWideLine, RiArrowRightWideFill } from 'react-icons/ri'
const CategorySection = () => {
  const categories = [
  { id: 1, category: "Indoor Lights" },
  { id: 2, category: "Outdoor Lights" },
  { id: 3, category: "Decorative Lights" },
  { id: 4, category: "Smart Lights" },
  { id: 5, category: "Lamps" },
  { id: 6, category: "Bulb & Tube Lights" },
];

  return (
    <div className={styles.main}>
      <div className={styles.sectionHeader}>
          <RiArrowLeftWideLine size={22} className={styles.nextBtn}/>
          <p>Shop By Category</p>
          <RiArrowRightWideFill size={22} className={styles.nextBtn}  />
      </div>


      <div className={styles.categoryCardContainer}>
        {categories.map((category)=>{
          return <CategoryCard  category={category.category}/>
        })}
        
      </div>
    </div>
  )
}

export default CategorySection
