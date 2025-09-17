import React from 'react'
import { useAppSelector } from '../../../redux/store'
import { useNavigate, useParams } from 'react-router-dom';

const LeftBar = () => {
    const onlineUsersState = useAppSelector (state => state.onlineUsers);
    const navigate = useNavigate();
    const { userId } = useParams();
  return (
    <div className='border min-w-[200px] border-gray-300 rounded'>
        <div className='p-4 border-b border-gray-300'>
            <h2 className='text-lg font-semibold'>Danh sách người dùng</h2>    
        </div>
        <div className='p-1 flex overflow-y-auto space-y-2 w-full flex-col'>
            {Object.entries(onlineUsersState.onlineUsers).map(([ui, data]) => (
                <div onClick={() => {
                    if(ui !== userId) navigate(`/chat/${ui}`);
                }} key={ui} className={`not-last:border-b p-4 border-gray-300 flex
                transition transform ease-out duration-300 cursor-pointer w-full
                justify-between items-center ${ui === userId ? 'bg-sky-500 text-white' : 'hover:bg-gray-100 '}`}>
                    <span>{ui}</span>
                    <span className={`w-3 h-3 rounded-full ${data.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LeftBar