import React from 'react'
import { useAppSelector } from '../../../redux/store'

const LeftBar = () => {
    const onlineUsersState = useAppSelector (state => state.onlineUsers);
    
  return (
    <div className='border min-w-[200px] border-gray-300 rounded'>
        <div className='p-4 border-b border-gray-300'>
            <h2 className='text-lg font-semibold'>Danh sách người dùng</h2>    
        </div>
        <div className='p-1 flex overflow-y-auto space-y-2 w-full flex-col'>
            {Object.entries(onlineUsersState.onlineUsers).map(([userId, data]) => (
                <div key={userId} className='not-last:border-b p-4 border-gray-300 flex
                hover:bg-gray-100 transition transform ease-out duration-300 cursor-pointer w-full
                justify-between items-center'>
                    <span>{userId}</span>
                    <span className={`w-3 h-3 rounded-full ${data.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LeftBar