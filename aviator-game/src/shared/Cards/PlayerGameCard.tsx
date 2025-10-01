import type { Player } from '../../models/models'
import './PlayerGameCard.css'


interface PlayerGameCardProps {
    player: Player;
}

export default function PlayerGameCard({player}: PlayerGameCardProps) {
    if (!player) return null;

    return (
        <>
            <div className="player-card">
                <img src="https://i.pravatar.cc/45" alt="avatar" className="player-avatar"/>
                <div className="player-info">
                    <span className="player-name">{player.username || 'Anónimo'}</span>
                    <span className="player-id">ID: {player.id_player || 'N/A'}</span>
                    <span className="player-balance">Saldo: ${player.remaining_money != null ? player.remaining_money.toFixed(2) : 'N/A'}</span>
                </div>
            </div>

        </>
    )
}