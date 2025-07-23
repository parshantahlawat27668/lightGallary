import axios from 'axios';
import React from 'react'
import { useDispatch } from 'react-redux'
import { setUsers } from '../../../store/adminUsers';

const Users = () => {
  const dispatch = useDispatch();
  axios.get("http://localhost:8000/api/v1/user")
  .then((response) =>{
    dispatch(setUsers(response.data.data.users));
  })
  .catch((err)=>{
    console.log(err)
  })
  return (
    <div>
      Users
    </div>
  )
}

export default Users;
