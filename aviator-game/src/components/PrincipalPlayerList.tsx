import type { Player } from "../models/models";
import PlayerGameCard from "../shared/Cards/PlayerGameCard";

interface PrincipalBetListProps {
    players: Player[];
}

export default function PrincipalPlayerList({ players }: PrincipalBetListProps) {
    return (
        <>
            {players.map((player) =>( 
                <PlayerGameCard
                    player={player}
                />
            ))
            }
        </>
    )
}