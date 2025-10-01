import { Paper, Typography } from "@mui/material";
import type { Bet } from "../models/models";

import './PrincipalBetList.css'

interface PropsPrincipalBetList {
    bets: Bet[];
}

const getClassStyleCard = (multiplyer: number): string => {
    if (multiplyer > 1) {
        return 'bet-card-win';
    }
    if (multiplyer === 1) {
        return 'bet-card';
    }
    return 'bet-card-lose'
}

export function PrincipalBetList({ bets }: PropsPrincipalBetList) {
    return (
        <Paper sx={{ p: 2, overflowY: "auto", background: "#121212" }}>
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
                    mt: 3,
                }}
            >
                Apuestas activas
            </Typography>



            {bets.map((bet) => (
                <div key={bet.id_bet} className={getClassStyleCard(bet.multiplyer ?? 0)}>
                    <div className="bet-header">
                        <span className="bet-player">{bet.player.username}</span>
                        <span className="bet-date">
                            {new Date(bet.date_bet).toLocaleTimeString("es-CO")}
                        </span>
                    </div>

                    <div className="bet-body">
                        <span className="bet-amount">${bet.amount.toLocaleString("es-CO")}</span>
                        <span className="bet-multiplier">x{bet.multiplyer}</span>
                    </div>
                </div>
            ))}
        </Paper>
    );
}
