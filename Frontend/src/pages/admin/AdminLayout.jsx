import React from 'react'
import styles from "./AdminLayout.module.css"
import { Link, Outlet } from 'react-router-dom'
import { TbLayoutDashboardFilled, TbTruckDelivery } from "react-icons/tb";
import { FaUserCircle, FaUsersCog } from "react-icons/fa";
import { LuLampDesk } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import logo from "../../assets/logo2.png"
const AdminLayout = () => {
  return (
    <div className={styles.main}>
        <div className={styles.header}>
         <h1 className={styles.logo}>LightGallery</h1>
         <div className={styles.adminName}><p style={{margin:"0px"}}>Admin Name</p> <FaUserCircle size={"22px"} /></div>
        </div>
        <div className={styles.body}>
      <div className={styles.sideBar}>
        <Link className={styles.link} to="/admin/dashboard"><TbLayoutDashboardFilled />Dashboard</Link>
        <Link className={styles.link} to="/admin/orders"><TbTruckDelivery />Orders</Link>
        <Link className={styles.link} to="/admin/products"><LuLampDesk />Products</Link>
        <Link className={styles.link} to="/admin/users"><FaUsersCog />Users</Link>
        <Link className={styles.link} to="/admin/stock"><FaBoxOpen />Stock</Link>
      </div>
      <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout
