import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { setUser } from '../../../redux/auth';

const Login = () => {
    const [userId, setUserId] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = { userId };
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        navigate("/");
    }


  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='p-4 rounded shadow w-[min(400px,90%)] border border-gray-300'>
          <form onSubmit={handleSubmit}>
            <h1 className='text-2xl text-center font-semibold mb-4'>Đăng nhập</h1>
            <input
              type="text"
              name='userId'
              placeholder="Nhập mã người dùng"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className='border border-gray-300 p-2 rounded w-full mb-4'
            />
            <button type="submit" disabled={!userId} className='bg-blue-500 text-white p-2 rounded w-full
            hover:bg-blue-600 transform duration-300 ease-in-out disabled:bg-gray-300'>Chat ngay</button>
          </form>
        </div>
    </div>
  )
}

export default Login