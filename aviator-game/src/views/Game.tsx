import './Game.css';

import { useEffect, useState } from "react";
import { getSocket } from "../utils/socket-service";
import { PrincipalBetList } from "../components/PrincipalBetList";
import { RenderAviatorGame } from "../components/RenderAviatorGame";
import { PlayerBetPanel } from "../components/PlayerBetPanel";



export interface Player {
    id: string;
    username: string;
    balance: number;
    currentBet: number;
    isConnected: boolean;
    hasCashedOut: boolean;
    cashOutMultiplier: number | null;
}


export default function Game() {
    const socket = getSocket()

    const [players, setPlayers] = useState<Player[]>([]);


    useEffect(() => {
        if (!socket) return
        socket.on("players_update", (playersList: Player[]) => {
            setPlayers(playersList)
        })

        return () => {
            socket.off("players_update")
        }
    }, [socket])

    return (
        <>
            <div className="game-layout">
                <aside className="bet-list">
                    <PrincipalBetList />
                </aside>

                <main className="game-board">
                    <RenderAviatorGame />
                </main>

                <footer className="player-panel">
                    <PlayerBetPanel />
                </footer>
            </div>
        </>
    )
}
