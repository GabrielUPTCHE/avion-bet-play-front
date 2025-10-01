import type { GameSession } from "../models/models";
import PlayerGameCard from "../shared/Cards/PlayerGameCard";

interface PrincipalBetListProps {
    gameSessions: GameSession[];
}

export default function PrincipalPlayerList({ gameSessions }: PrincipalBetListProps) {
    console.log('el game session', gameSessions)
    return (
        <>
            {gameSessions?.map((gameSession) => 
                gameSession?.player ? (
                    <PlayerGameCard
                        key={gameSession.player.id_player || gameSession.date_ingress}
                        player={gameSession.player}
                    />
                ) : null
            )}
        </>
    )
}