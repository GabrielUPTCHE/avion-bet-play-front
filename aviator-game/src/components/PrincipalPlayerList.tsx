import { Typography } from "@mui/material";
import type { Player } from "../models/models";
import PlayerGameCard from "../shared/Cards/PlayerGameCard";

interface PrincipalBetListProps {
    gameSessions: Player[];
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
            ></Typography>
            {gameSessions?.map((player) =>
                 (
                    <PlayerGameCard
                        key={player.id_player}
                        player={player}
                    />
                ) 
            )}
        </>
    )
}