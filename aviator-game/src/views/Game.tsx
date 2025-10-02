import './Game.css';

import { useState } from "react";
import { getSocket } from "../utils/socket-service";
import { PrincipalBetList } from "../components/PrincipalBetList";
import { RenderAviatorGame } from "../components/RenderAviatorGame";
import { PlayerBetPanel } from "../components/PlayerBetPanel";
import type { Bet, GameSession, Player } from '../models/models';
import PrincipalPlayerList from '../components/PrincipalPlayerList';






export default function Game() {
    const socket = getSocket()
    const actualRound = 0;
    
    const [time, setTime] = useState<number>(0);
    const [title, setTitle] = useState<string>('Prepara tu apuesta');
    const [isRunning, setIsRunning] = useState(false);


    const [players, setPlayers] = useState<Player[]>([
    ]);
    const [bets, setBets] = useState<Bet[]>([]);
    

    socket.on("players_update", (playersList: Player[]) => {
        setPlayers(playersList)
    })

    socket.on("bets_update", (result) => {
            setBets(result.game_rounds[actualRound].bets)
    });

    socket.on("tick", ({secondsLeft}) =>{
        setTime(secondsLeft);
    })
    
     socket.on("update_round_state", ({newState,isBetTime,title}) =>{
        setTitle(title);
    })

    socket.on("connect_error", (err) => {
        console.error("❌ Error de conexión:", err.message);
    });

    socket.on("connect", (err) => {
        console.error("hizo el connect:", err.message);
        socket.emit("join_game", {
            username:localStorage.getItem("username")??'notuser',
            register_date: new Date().toISOString(),
        })
        

        navigate("/game")
    });

    //intenta reconectar

    socket.io.on("reconnect_attempt", (result) => {
      console.log('hace esta joda 1', result)
    });
    
    socket.io.on("reconnect", (result) => {
        setIsReconnecting(false);
        console.log('hace esta joda 2', result)
    });
    
    socket.io.on("reconnect_failed", (result) => {
        setIsReconnecting(false);
        console.log('hace esta joda 3', result)
    });
    return (
        <>
            
            <div className="game-layout">

                <section className="player-list">
                    <PrincipalPlayerList
                        gameSessions={players}
                    />
                </section>
                <aside className="bet-list">
                    <PrincipalBetList
                        bets={bets}
                    />
                </aside>

                <main className="game-board">
                    <RenderAviatorGame
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                    />
                </main>

                <footer className="player-panel">
                    <PlayerBetPanel 
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                    />
                </footer>
            </div>
        </>
    )
}
