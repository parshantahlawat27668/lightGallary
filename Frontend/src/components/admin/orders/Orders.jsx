import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setOrders } from '../../../store/adminOrders';


const Orders = () => {
 const dispatch =  useDispatch();
 useEffect(()=>{
  axios.get("http://localhost:8000/api/v1/orders/admin")
  .then((response)=>{
    dispatch(setOrders(response.data.data));
  })
  .catch((err)=>{
    console.log(err)
  })
 },[]);
  return (
    <div>
      Orders
    </div>
  )
}

export default Orders
