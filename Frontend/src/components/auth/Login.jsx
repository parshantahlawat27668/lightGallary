import React, { useState } from 'react'
import styles from "./Login.module.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { toast } from 'react-toastify';
import { loginSuccess } from '../../store/user';
import {useDispatch} from "react-redux"
const Login = () => {
  const navigate = useNavigate();
  const  dispatch = useDispatch();
  const [loginWith, setLoginWith] = useState("phone");
  const changeLoginMethod = () => {
    if (loginWith === "phone") {
      setLoginWith("email");
    }
    else {
      setLoginWith("phone");
    }
  }
  const loginHandler = async(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const res =  axios.post("http://localhost:8000/api/v1/user/login",data,{withCredentials:true})
    .then((result)=>{
      const user = result.data.data.user;
      toast.success(result.data.message);
      dispatch(loginSuccess(user));
      if(user.role==="admin"){
        navigate("/admin/dashboard");
      }
      else{
        navigate("/shop/home");
      }
      // dispatch(loginSuccess(result.data.user, result.data.accessToken));
    })
    .catch((err)=>{
      toast.error(err.response.data.message)
    });
    e.target.reset();
  }
  return (
    <div className={styles.main}>
    <form className={styles.form} onSubmit={loginHandler}>
      <h2>Login</h2>
      <hr/>
      {loginWith==="phone"?<div className={styles.groupField}>
        <label htmlFor='phone'>Phone</label>
        <input required type='tel' id='phone' name='phone' placeholder='Enter your phone no.'></input>
        <p onClick={changeLoginMethod}>login with email</p>
      </div>:
      <div className={styles.groupField}>
        <label htmlFor='email'>Email</label>
        <input required type='email' id='email' name='email' placeholder='Enter your email id'></input>
        <p onClick={changeLoginMethod}>login with phone</p>
      </div>}
      <div className={styles.groupField}>
      <label htmlFor='password'>Password</label>
      <input required type='password' id='password' name='password' placeholder='Minimum 6 characters' ></input>
      </div>
      <button type='submit' className={styles.btn}>Login</button>
      <p>Don't have an account? <Link to="/auth/register" style={{color:"#e6c058"}}>register</Link></p>
    </form>
    </div>
  )
}

export default Login;
