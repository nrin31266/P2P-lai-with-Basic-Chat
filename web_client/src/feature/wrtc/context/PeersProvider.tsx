import React, { createContext, useContext, useRef, useState } from "react"
import SimplePeer from "simple-peer";


export interface PeerConnection {
    peer: SimplePeer.Instance
    connected: boolean,
    type : string
}

interface PeersContextType {
    peers: Map<string, PeerConnection>
    addPeer: (userId: string, peer: SimplePeer.Instance, type: string) => void
    updatePeer: (userId: string, updates: Partial<PeerConnection>) => void
    removePeer: (userId: string) => void,
    peersMap: Map<string, PeerConnection>
}

const PeersContext = createContext<PeersContextType | null>(null)

export const PeersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const peersRef = useRef<Map<string, PeerConnection>>(new Map())
    const [peersMap, setPeersMap] = useState<Map<string, PeerConnection>>(new Map())

    const addPeer = (userId: string, peer: SimplePeer.Instance, type: string) => {
        // 
        // if (peersRef.current.has(userId)) {
        //     peersRef.current.get(userId)?.peer.destroy();
        // }
        peersRef.current.set(userId, { connected: false, peer, type });
        setPeersMap(new Map(peersRef.current));
    }

    const updatePeer = (userId: string, updates: Partial<PeerConnection>) => {
        const existing = peersRef.current.get(userId)
        if (existing) {
            peersRef.current.set(userId, { ...existing, ...updates })
            setPeersMap(new Map(peersRef.current));
        }
    }

    const removePeer = (userId: string) => {
        const existing = peersRef.current.get(userId)
        if (existing) {
            // existing.peer.destroy()
            peersRef.current.delete(userId)
            setPeersMap(new Map(peersRef.current));
        }
    }


    return (
        <PeersContext.Provider
            value={{
                peers: peersRef.current,
                addPeer,
                updatePeer,
                removePeer,
                peersMap
            }}
        >
            {children}
        </PeersContext.Provider>
    )
}

export const usePeers = () => {
    const ctx = useContext(PeersContext)
    if (!ctx) throw new Error("usePeers must be used within PeersProvider")
    return ctx
}
