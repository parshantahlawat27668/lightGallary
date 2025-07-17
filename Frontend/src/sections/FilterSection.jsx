import React, { useEffect, useRef, useState } from 'react'
import styles from './FilterSection.module.css'
import { PiSlidersHorizontalDuotone } from "react-icons/pi";
import { useSearchParams } from "react-router-dom"
import Product from '../components/user/Product'
import { useSelector } from "react-redux"
import { selectAllProducts } from '../store/selectors/productsSelectors';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    category: "Indoor lights",
    subCategory: [
      "Ceiling Light",
      "Panel Light",
      "Chandeliers",
      "Track Light",
      "Wall Light"
    ]
  },
  {
    category: "Outdoor lights",
    subCategory: [
      "Flood Light",
      "Street Light",
      "Garden Light",
      "Gate Light",
      "Bollard Light"
    ]
  },
  {
    category: "Decorative lights",
    subCategory: [
      "String Lights",
      "Lanterns",
      "Wall Art Lights",
      "Neon Sign",
      "Festive Lights"
    ]
  },
  {
    category: "Smart lights", 
    subCategory: [
      "Smart Bulb",
      "Smart Strip",
      "Motion Sensor Light",
      "Voice Controlled Light"
    ]
  },
  {
    category: "Lamps",
    subCategory: [
      "Table Lamp",
      "Floor Lamp",
      "Desk Lamp",
      "Study Lamp",
      "Bedside Lamp"
    ]
  },
  {
    category: "Basic lights",
    subCategory: [
      "LED Bulb",
      "CFL Bulb",
      "Tube Light",
      "Rechargeable Bulb"
    ]
  }
];




const FilterSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParams = searchParams.get("category");
  const allProducts = useSelector((state) => selectAllProducts(state));
  const [displayProducts, setDisplayProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [subCategoryArray, setSubCategoryArray] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const getSortedProducts = (products, sortBy) => {
    switch (sortBy) {
      case "low-to-high":
        return [...products].sort((a, b) => a.price - b.price);

      case "high-to-low":
        return [...products].sort((a, b) => b.price - a.price);

      case "newest-first":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      case "oldest-first":
        return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      default:
        return products;
    }
  }
  const getFilteredProducts = () => {
    if (category === "All") {
      return allProducts;
    }
    const filteredProducts = allProducts?.filter((product) => (product.category.trim().toLowerCase() === category.trim().toLocaleLowerCase() && subCategoryArray?.includes(product.subCategory)));

    return filteredProducts;
  }

  const updateDisplayProducts = () => {
    const filteredProducts = getFilteredProducts();
    const sortedProducts = getSortedProducts(filteredProducts, sortBy);
    setDisplayProducts(sortedProducts);
  }


  useEffect(() => {
    setCategory(categoryParams || "All");
  }, [categoryParams]);

  useEffect(() => {
    const selectedCategory = categories.find((product) => product.category.trim().toLowerCase() === category.trim().toLowerCase());
    setSelectedSubCategories(selectedCategory?.subCategory || []);
    setSubCategoryArray(selectedCategory?.subCategory || []);
  }, [category]);




  useEffect(() => {
    updateDisplayProducts();
  }, [subCategoryArray, sortBy]);








  const categoryChangeHandler = (e) => {
    navigate(`/shop/filter/?category=${e.target.value}`);
  }

  const subCategoryChangeHandler = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      if (!subCategoryArray.includes(value)) {
        setSubCategoryArray((prev) => [...prev, value]);
      }
    } else {
      setSubCategoryArray((prev) => prev.filter((sub) => sub !== value));
    }
    console.log(subCategoryArray);
  };

  const sortChangeHandler = (e) => {
    setSortBy(e.target.value);
    console.log("sort value change ", e.target.value);
  }

// const userString = localStorage.getItem("activeUser");
// const user = userString ? JSON.parse(userString) : null;

const user = useSelector((state)=>state.user.activeUser);
const wishlist = user?.wishList?.map((id) => id.toString()) || [];
const wishlistSet = new Set(wishlist);
const isWishListed = (productId) => wishlistSet.has(productId.toString());





  return (
    <div className={styles.main}>
      <div className={styles.filter}>
        <div className={styles.filterHeader}>
          <PiSlidersHorizontalDuotone size={22} />
          Filter
        </div>
        <div className={styles.filters}>

          <div className={styles.category}>
            <label htmlFor='cagegory'>Category</label>
            <select id='category' name='category' className={styles.categoryInput} value={category} onChange={(e) => categoryChangeHandler(e)}>
              <option value="All">All</option>
              <option value="Indoor lights">Indoor lights</option>
              <option value="Outdoor lights">Outdoor lights</option>
              <option value="Decorative lights">Decorative lights</option>
              <option value="Smart lights">Smart lights</option>
              <option value="Lamps">Lamps</option>
              <option value="Basic lights">Basic lights</option>
            </select>
          </div>

          <div className={styles.subCategory}>
            <p>Sub Category</p>
            {
              selectedSubCategories?.map((subCategory, index) => {
                return <label key={index} ><input
                  type='checkbox'
                  value={subCategory}
                  checked={subCategoryArray.includes(subCategory)}
                  onChange={subCategoryChangeHandler}
                />{subCategory}</label>
              })
            }

          </div>

          <div className={styles.sort}>
            <p>Sort By</p>
            <label><input type='radio' name='sort' value='low-to-high' onChange={(e) => sortChangeHandler(e)} />Price ( low to high )</label>
            <label><input type='radio' id='sort' name='sort' value='high-to-low' onChange={(e) => sortChangeHandler(e)} />Price ( high to low )</label>
            <label><input type='radio' name='sort' value='oldest-first' onChange={(e) => sortChangeHandler(e)} />Oldest First</label>
            <label><input type='radio' name='sort' value='newest-first' onChange={(e) => sortChangeHandler(e)} />Newest First</label>
          </div>
        </div>
      </div>
      <div className={styles.productsContainer}>
        {
          displayProducts?.map((product, index) => {
            return <Product product={product} key={index} wishListed={isWishListed(product._id)} />
          })
        }
      </div>
    </div>
  )
}

export default FilterSection
