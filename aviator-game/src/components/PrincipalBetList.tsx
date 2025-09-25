import { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Paper,
} from "@mui/material";
import { getSocket } from "../utils/socket-service";
import type { Player } from "../views/Game";

export function PrincipalBetList() {
    const [players, setPlayers] = useState<Player[]>([]);
    const socket = getSocket();

    socket.on("players_update", (list: Player[]) => {
        console.log('lista de jugadores', list);
        setPlayers(list);
    });

    socket.on("bets_update", (player: Player) => {
        console.log('nueva apuesta', player);
    });

    return (
        <Paper sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
                Apuestas activas
            </Typography>
            <List>
                {players.map((p, index) => (
                    <ListItem key={p.id} divider>
                        <ListItemAvatar>
                            <Avatar>{index + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Jugador ${p.username}`}
                            secondary={`Apuesta: $${p.currentBet?.toLocaleString("es-CO") ?? 0}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
