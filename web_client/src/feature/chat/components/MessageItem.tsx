
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { DateUtils } from '../../../util/dateUtils';
export interface IMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
}
const MessageItem = ({ message }: { message: IMessage }) => {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const isSender = message.senderId === userId;
  const dispatch = useAppDispatch();




  return (
    <div className={`${isSender ? 'ml-auto' : 'mr-auto'} text-sm max-w-[80%] text-gray-600 border py-2 px-4 break-words ${isSender ? 'bg-sky-500 text-white rounded-[0.5rem_0.5rem_0rem_0.5rem]' :
      'bg-gray-400 text-white rounded-[0.5rem_0.5rem_0.5rem_0rem]'}`}>
      <p>{message.content}</p>
      <div className='flex items-center justify-between mt-1'>
        <span className="text-[0.7rem] text-gray-200">{DateUtils.timeAgo(new Date(message.createdAt))}</span>
      </div>
    </div>
  )
}

export default MessageItem
