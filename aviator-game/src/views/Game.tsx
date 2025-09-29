import './Game.css';

import { useState } from "react";
import { getSocket } from "../utils/socket-service";
import { PrincipalBetList } from "../components/PrincipalBetList";
import { RenderAviatorGame } from "../components/RenderAviatorGame";
import { PlayerBetPanel } from "../components/PlayerBetPanel";
import type { Bet, Player } from '../models/models';
import PrincipalPlayerList from '../components/PrincipalPlayerList';






export default function Game() {
    const socket = getSocket()
    const actualRound = 0;
    
    const [time, setTime] = useState<number>(0);
    const [title, setTitle] = useState<string>('');

    const [players, setPlayers] = useState<Player[]>([]);
    const [bets, setBets] = useState<Bet[]>([]);
    

    socket.on("players_update", (playersList: Player[]) => {
        console.log('los player list', playersList);
        setPlayers(playersList)
    })

    socket.on("bets_update", (result) => {
        console.log("cambiaron:", result);
        setBets(result.game_rounds[actualRound].bets)
    });

    socket.on("tick", ({secondsLeft}) =>{
        console.log('el tiempo pasa y se nos va la vida',secondsLeft)
        setTime(secondsLeft);
    })
    
     socket.on("update_round_state", ({newState,isBetTime,title}) =>{
        console.log('a',newState, isBetTime)
        setTitle(title);
    })
    return (
        <>
            <h1>{time}         {title}</h1>
            <div className="game-layout">

                <section className="player-list">
                    <PrincipalPlayerList
                        players={players}
                    />
                </section>
                <aside className="bet-list">
                    <PrincipalBetList
                        bets={bets}
                    />
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
