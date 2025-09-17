import React, { useEffect } from 'react'

import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { fetchOnlineUsers, setOnlineUsers, updateUserStatus, type IOnlineUserDto } from '../redux/onlineUsers'
import WebSocketProvider, { useWebSocket } from '../feature/ws/WebSocketProvider'


import { PeersProvider, usePeers } from '../feature/wrtc/context/PeersProvider'
import SimplePeer from "simple-peer";
import { addPeerConnection, clearAllConnections, updatePeerStatus } from '../redux/peerConnections'
import { addMessage } from '../redux/chat'

// import SimplePeer from "simple-peer"




const AppLayout = () => {
    return (
        <WebSocketProvider>
            <PeersProvider>
                <StartApp />
                <div className='grid grid-rows-[auto_1fr] h-screen gap-4'>
                    <AppHeader />
                    <Outlet />
                </div>
            </PeersProvider>
        </WebSocketProvider>
    )
}

export default AppLayout

const StartApp = () => {
    const authUserId = useAppSelector(state => state.auth.user?.userId);
    const dispatch = useAppDispatch();
    const ws = useWebSocket();
    const { peers, addPeer, updatePeer, removePeer } = usePeers()

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

    }, [ws, authUserId, dispatch]);

    useEffect(() => {

        if (!ws || !authUserId) return;
        const subscription = ws.subscribe("/user/queue/signal", (message) => {
            const { fromUserId, type, signalData } = JSON.parse(message.body);
            if (type === "offer") {
                console.log("📩 Received offer:", { fromUserId, signalData });
                // Xử lý offer ở đây (ví dụ: tạo peer connection, tạo answer, gửi lại answer)
                // Khi nhận offer → tạo peer mới
                const peer = new SimplePeer({
                    initiator: false,
                    trickle: false,
                });
                // Khi peer tạo answer → gửi trả lại
                peer.on("signal", (answer) => {
                    ws.send("/app/signal", {}, JSON.stringify({
                        toUserId: fromUserId,
                        type: "answer",
                        signalData: answer
                    }));
                });
                peer.on("connect", () => {
                    console.log(`✅ Connected with ${fromUserId}`);
                    updatePeer(fromUserId, { connected: true });
                    dispatch(updatePeerStatus({ userId: fromUserId, connected: true }));
                    console.table(peers);
                });

                peer.on("data", (res) => {
                    const data = JSON.parse(res.toString());
                    if (data.type === "bye" && data.fromUserId === fromUserId) {
                        console.log(`❌ Peer connection closed by ${fromUserId}`);
                        peer.destroy(); // đảm bảo connection thực sự đóng
                    }
                    if (data.type === 'chat-message') {
                        console.log("Received chat message:", data.content);
                        dispatch(addMessage({ message: data.content })); // Dispatch action to add message to Redux store
                    }
                });

                peer.on("close", () => {
                    removePeer(fromUserId);
                    dispatch(updatePeerStatus({ userId: fromUserId, connected: false }));
                    console.table(peers);
                    dispatch(updateUserStatus({ userId: fromUserId, isOnline: false }));
                });
                peer.signal(signalData);
                addPeer(fromUserId, peer, "answer");
                dispatch(addPeerConnection({ userId: fromUserId, connected: true }));

            }
            if (type === "answer") {
                console.log("📩 Received answer:", { fromUserId, signalData });
                const conn = peers.get(fromUserId);
                if (conn) {
                    conn.peer.signal(signalData);
                }
            }
        });
        return () => {
            subscription.unsubscribe();
        };

    }, [ws, authUserId, dispatch]);

    useEffect(() => {
        return () => {
            console.log("Cleaning up all peer connections");
            closeAllPeers();
        };
    }, []);

    const closeAllPeers = () => {
        peers.forEach(({ peer }, userId) => {
            try {
                console.log(`Sending 'bye' to ${userId}`);
                peer.send(JSON.stringify({ type: "bye", fromUserId: authUserId }));
            } catch (err) {
                // peer chưa connect → ignore

            }
        });
        peers.clear();
        dispatch(clearAllConnections());

    };



    useEffect(() => {
        if (!authUserId || !ws) return;
        dispatch(fetchOnlineUsers()).unwrap().then((data) => {
            console.log("Fetched online users:", data);
            dispatch(setOnlineUsers({ userIds: data, authUserId: authUserId }));
            data.filter(id => id !== authUserId).forEach(userId => {
                createPeer(userId);
            });
        });
    }, [dispatch, authUserId, ws]);


    // Hàm tạo peer với vai trò initiator
    const createPeer = (targetUserId: string) => {
        if (!ws || !authUserId) return;

        const peer = new SimplePeer({ initiator: true, trickle: false });

        peer.on("signal", (offer) => {
            ws.send("/app/signal", {}, JSON.stringify({
                toUserId: targetUserId,
                type: "offer",
                signalData: offer,
            }));
        });

        peer.on("connect", () => {
            console.log(`✅ Connected with ${targetUserId}`);
            updatePeer(targetUserId, { connected: true });
            dispatch(updatePeerStatus({ userId: targetUserId, connected: true }));
            console.table(peers);
        });
        peer.on("data", (res) => {
            const data = JSON.parse(res.toString());
            if (data.type === "bye" && data.fromUserId === targetUserId) {
                console.log(`❌ Peer connection closed by ${targetUserId}`);
                peer.destroy(); // đảm bảo connection thực sự đóng
                dispatch(updateUserStatus({ userId: targetUserId, isOnline: false }));
            }
            if (data.type === 'chat-message') {
                console.log("Received chat message:", data.content);
                dispatch(addMessage({ message: data.content })); // Dispatch action to add message to Redux store
            }
        });

        peer.on("close", () => {
            removePeer(targetUserId);
            dispatch(updatePeerStatus({ userId: targetUserId, connected: false }));
            console.table(peers);
        });

        addPeer(targetUserId, peer, "offer");
        dispatch(addPeerConnection({ userId: targetUserId, connected: true }));
    };

    return null;
}