//import { useState } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Paper,
} from "@mui/material";
//import { getSocket } from "../utils/socket-service";
import type { Bet } from "../models/models";

interface PropsPrincipalBetList {
    bets: Bet[]
}

export function PrincipalBetList({bets}:PropsPrincipalBetList) {
    //const socket = getSocket();
    

   
   
    return (
        <Paper sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
                Apuestas activas
            </Typography>
            <List>
                {bets.map((bet, index) => (
                    <ListItem key={bet.id_bet} divider>
                        <ListItemAvatar>
                            <Avatar>{index + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Jugador ${bet.player.username}`}
                            secondary={`Apuesta: $${bet.amount?.toLocaleString("es-CO") ?? 0}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
