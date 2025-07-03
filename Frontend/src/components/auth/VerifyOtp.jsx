import React, { useEffect, useRef, useState } from 'react'
import styles from "./VerifyOtp.module.css"
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {useDispatch} from "react-redux"
import { loginSuccess } from '../../store/user.js';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location  = useLocation();
  const phone = location.state?.phone;
  const length = 6;
  const [otp,setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  useEffect(()=>{
  inputRefs.current[0]?.focus();  
  },[]);

  const handleChange=(e, index)=>{
    const value = e.target.value;
    if(!/^[0-9]?$/.test(value)) return;

    const newOtp=[...otp];
    newOtp[index]=value;
    setOtp(newOtp);

    if(value && index < length-1){
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleKeyDown=(e, index)=>{
    if(e.key ==="Backspace" && !otp[index] && index > 0){
      inputRefs.current[index - 1]?.focus();
    }
  }
  const verifyHandler= async (e)=>{
    e.preventDefault();
    const finalOtp = otp.join("");
    if(finalOtp.length!==6){
      toast.error("Incomplete OTP");
    }
    await axios.post("http://localhost:8000/api/v1/user/verify-phone",{phone:phone,otp:finalOtp})
    .then(
      (result)=>{
        const user = result.data.data.user;
        dispatch(loginSuccess(user));
        toast.success(result.data.message);
        if(user.role==="admin"){
          navigate("/admin/dashboard");
        }
        else{
          navigate("/shop/home");
        }
      }
    )
    .catch((error)=>{
      toast.error(error.response.data.message);
    });
  }

  return (
    <div className={styles.main}>
      <form className={styles.form}>
        <h2>Verification</h2>
        <p>Verify your phone number to continue</p>
        <hr/>
        <div className={styles.otpContainer}>
         {
          otp.map((digit,index)=>(
            <input key={index} value={digit} required type='text' inputMode='numeric' maxLength="1"  onChange={(e)=>handleChange(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)} ref={(el)=>(inputRefs.current[index] = el)}></input>
          ))
         }
        </div>
        <button type='submit' className={styles.btn} onClick={verifyHandler}>Verify</button>
        <p className={styles.resendOtp}>Resend OTP</p>
      </form>
    </div>
  )
}

export default VerifyOtp;
