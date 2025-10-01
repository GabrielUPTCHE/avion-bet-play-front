import { Typography } from "@mui/material";
import type { GameSession } from "../models/models";
import PlayerGameCard from "../shared/Cards/PlayerGameCard";

interface PrincipalBetListProps {
    gameSessions: GameSession[];
}

export default function PrincipalPlayerList({ gameSessions }: PrincipalBetListProps) {
    return (
        <>
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: "#e6e9d2ff",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    paddingBottom: "8px",
                    borderBottom: "2px solid #333", 
                    mb: 3,
                    mt: 7,
                }}
            >
                Jugadores Activos
            </Typography>
            {gameSessions.map((gameSession) =>( 
                <PlayerGameCard
                    player={gameSession.player}
                />
            ))
            }
        </>
    )
}