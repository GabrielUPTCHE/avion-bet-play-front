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


    const [players, setPlayers] = useState<GameSession[]>([
        {
            player:{
                id_player:'1',
                register_date:null,
                username: 'Gabriel'
            },
            date_exit:null,
            date_ingress: 'null'
        },
        {
            player:{
                id_player:'2',
                register_date:null,
                username: 'Daniel'
            },
            date_exit:null,
            date_ingress: 'null'
        },
        {
            player:{
                id_player:'3',
                register_date:null,
                username: 'Deivid'
            },
            date_exit:null,
            date_ingress: 'null'
        },
        {
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            },
            date_exit:null,
            date_ingress: 'null'
        }
    ]);
    const [bets, setBets] = useState<Bet[]>([

        {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1.2,
            id_bet:'1',
            player:{
                id_player:'1',
                register_date:null,
                username: 'Gabriel'
            }
        },
        {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1.2,
            id_bet:'1',
            player:{
                id_player:'2',
                register_date:null,
                username: 'Daniel'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:0,
            id_bet:'1',
            player:{
                id_player:'3',
                register_date:null,
                username: 'Deivid'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
         {
            amount:1000,
            date_bet:new Date().toString(),
            ganancy:0,
            multiplyer:1,
            id_bet:'1',
            player:{
                id_player:'4',
                register_date:null,
                username: 'Edison'
            }
        },
    ]);
    

    socket.on("players_update", (playersList: GameSession[]) => {
        setPlayers(playersList)
        console.log('los jugadores', playersList)
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
                    <PlayerBetPanel />
                </footer>
            </div>
        </>
    )
}
