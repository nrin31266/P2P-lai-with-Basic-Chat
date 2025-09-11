import React from 'react'
import { useAppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/auth';

const AppHeader = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("user");
      dispatch(clearUser());
      navigate("/auth/login");
      
    };
  return (
    <div className='flex justify-between items-center p-4 bg-sky-800 text-white'>
      <h1 className='text-lg font-bold'>Basic Chat App với P2P lai</h1>
      <div className='flex items-center gap-4'>
        <h4>Tài khoản: <span className='font-semibold'>{JSON.parse(localStorage.getItem("user") || "{}").userId}</span></h4>
        |
        <nav>
        <a className='hover:underline cursor-pointer' onClick={handleLogout}>Đăng xuất</a>
      </nav>
      </div>
    </div>
  )
}

export default AppHeader