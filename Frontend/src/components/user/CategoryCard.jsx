import React from 'react'
import styles from "./CategoryCard.module.css"
import image from "../../assets/tableLamp.avif"
import { SiEthiopianairlines } from "react-icons/si";
const CategoryCard = ({category}) => {
  return (
    <div className={styles.categoryCard}>
      <img src={image} className={styles.categoryImg}></img>
      <div className={styles.categoryName}>
        <SiEthiopianairlines className={styles.leftWing} color='white'/>
        <p>{category}</p>
        <SiEthiopianairlines className={styles.rightWing} color='white'/>
        </div>
    </div>
  )
}

export default CategoryCard;
