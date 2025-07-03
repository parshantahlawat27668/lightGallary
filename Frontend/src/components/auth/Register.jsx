import React from 'react'
import styles from "./Register.module.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const Register = () => {
  const navigate = useNavigate();
  const registerHandler = async(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    await axios.post("http://localhost:8000/api/v1/user/register",data)
    .then((result)=>{
      toast.success(result.data.message);
      navigate("/auth/verify-phone",{state:{phone:data.phone}});
    })
    .catch((err)=>{
      toast.error(err.response.data.message);
    });
    e.target.reset();
  }
  return (
    <div className={styles.main}>
    <form className={styles.form} onSubmit={registerHandler}>
      <h2>Register</h2>
      <hr/>
      <div className={styles.groupField}>
    <label htmlFor="name">Name</label>
    <input required type='text' id='name' name='name' placeholder='Enter your full name'></input>
    </div>
    <div className={styles.groupField}>
    <label htmlFor='phone'>Phone</label>
    <input required type='tel' id='phone' name='phone' placeholder='Enter your phone no.'></input>
    </div>
    <div className={styles.groupField}>
    <label htmlFor='password'>Password</label>
    <input required type='password' id='password' name='password' placeholder='Minimum 6 characters'></input>
    </div>
    <button type='submit' className={styles.btn}>Register</button>
    <p>Already have an account? <Link to="/auth/login" style={{color:"#C7AE6A"}}>login</Link></p>
    </form>
    </div>
  )
}

export default Register
