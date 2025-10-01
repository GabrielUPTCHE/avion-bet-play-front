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
    

    socket.on("players_update", (playersList: GameSession[]) => {
        setPlayers(playersList)
        console.log('los jugadores', playersList)
    })

    socket.on("bets_update", (result) => {
        console.log('se actualizaron ...', result)
        setBets(result.game_rounds[actualRound].bets)
    });

    socket.on("tick", ({secondsLeft}) =>{
        setTime(secondsLeft);
    })
    
     socket.on("update_round_state", ({newState,isBetTime,title}) =>{
        setTitle(title);
    })
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
