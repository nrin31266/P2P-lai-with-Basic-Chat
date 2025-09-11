import React, { useEffect } from 'react'
import WebSocketProvider, { useWebSocket } from '../ws/WebSocketProvider'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { fetchOnlineUsers, setOnlineUsers, updateUserStatus, type IOnlineUserDto } from '../redux/onlineUsers'

const AppLayout = () => {
    return (
        <WebSocketProvider>
            <StartApp />
            <div className='grid grid-rows-[auto_1fr] h-screen gap-4'>
                <AppHeader />
                <Outlet />
            </div>
        </WebSocketProvider>
    )
}

export default AppLayout

const StartApp = () => {
    const authUserId = useAppSelector(state => state.auth.user?.userId);
    const dispatch = useAppDispatch();
    const ws = useWebSocket();

    useEffect(() => {
        
        if (!ws || !authUserId) return;
        const subscription = ws.subscribe("/topic/online-users", (message) => {
            const body: IOnlineUserDto = JSON.parse(message.body);
            console.log("Received online user update:", body);
            dispatch(updateUserStatus(body));

        });
        return () => {
            subscription.unsubscribe();
        };

    }, [ws, authUserId]);

    useEffect(() => {
        if (!authUserId) return;
        dispatch(fetchOnlineUsers()).unwrap().then((data) => {
            dispatch(setOnlineUsers({ userIds: data, authUserId: authUserId }));
        });
    }, [dispatch, authUserId]);
    return null;
}