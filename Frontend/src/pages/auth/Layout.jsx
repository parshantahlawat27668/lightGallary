import React from 'react'
import styles from "./layout.module.css"
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className={styles.layoutPage}>
      <div className={styles.blur}></div>
      <div className={styles.formContainer}>
      <Outlet/>
      </div>
    </div>
  )
}

export default Layout;
