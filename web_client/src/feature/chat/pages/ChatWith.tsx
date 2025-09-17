import React from 'react'
import ConversationBottom from '../components/ConversationBottom'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { useParams } from 'react-router-dom';
import MessageItem, { type IMessage } from '../components/MessageItem';
import { usePeers } from '../../wrtc/context/PeersProvider';
import { v4 as uuidv4 } from 'uuid';
import { addMessage } from '../../../redux/chat';
const EMPTY_CONVERSATION = { messages: [] };
const ChatWith = () => {
  const authId = useAppSelector(state => state.auth.user?.userId);
  const { userId } = useParams();
   // Memo hóa conversation selector
  const conversation = useAppSelector(state => {
    return (
      state.chat.conversations[authId + ":" + userId] ||
      state.chat.conversations[userId + ":" + authId] ||
      EMPTY_CONVERSATION // dùng object cố định
    );
  });
  const dispatch = useAppDispatch();
  const { peers } = usePeers();
const peerObj = peers.get(userId || '');
const peer = peerObj?.peer;
const isConnected = peerObj?.connected;

if (!peer || !userId || !authId || !isConnected) {
  console.log("Peer not found or not connected:", { peer, userId, authId, isConnected });
  return <div className='flex items-center justify-center h-full text-gray-400'>
    <p>Không thể kết nối với người dùng này</p>
  </div>
}
  return (
    <div className='grid grid-rows-[1fr_auto] min-h-full border rounded border-gray-300'>

      <div className='p-4'>
        {conversation.messages.length == 0 ? (
          <div className='flex items-center justify-center h-full text-gray-400'>
            <p>No messages yet</p>
          </div>
        ) : (
          <div className='flex flex-col space-y-2 overflow-y-auto'>
            {conversation.messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      <ConversationBottom onSendMessage={(message) => { 
        const data : IMessage = {
          id:  uuidv4(),
          content: message,
          createdAt: new Date().toISOString(),
          senderId: authId,
          receiverId: userId
        };


        peer.send(JSON.stringify({ type: 'chat-message', content: data }));
        dispatch(addMessage({message: data}));
      }} />
    </div>
  )
}

export default ChatWith