import type { Player } from '../../models/models'
import './PlayerGameCard.css'


interface PlayerGameCardProps {
    player: Player;
}

export default function PlayerGameCard({player}: PlayerGameCardProps) {
    return (
        <>
            <div className="player-card">
                <img src="https://i.pravatar.cc/45" alt="avatar" className="player-avatar"/>
                    <div className="player-info">
                        <span className="player-name">{player.username}</span>
                        <span className="player-id">ID: {player.id_player}</span>
                    </div>
            </div>

        </>
    )
}