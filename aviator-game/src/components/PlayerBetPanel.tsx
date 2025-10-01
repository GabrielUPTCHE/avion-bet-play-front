import { useState } from "react";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { getSocket } from "../utils/socket-service";

import './PlayerBetPanel.css'

export function PlayerBetPanel() {
    const [amount, setAmount] = useState<number | null>(null);
    const [hasBet, setHasBet] = useState(false);
    const socket = getSocket();

    const handleBet = () => {
        if (!socket || !amount) return;
        console.log('emitiendo apuesta', { id: socket.id, amount });
        socket.emit("new_bet", {
            id: socket.id,
            amount,
        });
        setHasBet(true);
    };

    const handleCancel = () => {
        if (!socket) return;
        console.log('cancelando ', socket.id)
        socket.emit("cancel_bet", { id_player: socket.id });
        setHasBet(false);
        setAmount(null);
    };

    return (
        <>
            <div className="section-principal-bet">
                <div className="section-bet">
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <NumericFormat
                        value={amount ?? ""}
                        customInput={TextField}
                        label="Monto de apuesta"
                        variant="outlined"
                        fullWidth
                        className="input-bet"
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="$"
                        disabled={hasBet}
                        onValueChange={(values) => setAmount(values.floatValue ?? null)}
                    />


                </Box>
            </div>

            <div className="section-stats">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-title">Saldo Total</div>
                        <div className="stat-value saldo">$10,500.00</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-title">Ganancia Última Ronda</div>
                        <div className="stat-value ganancia">+$1,200.00</div>
                    </div>
                </div>
            </div>
            </div>

            <div className="section-buttons">
                {!hasBet ? (
                    <Button
                        variant="contained"
                        color="success"
                        disabled={!amount}
                        onClick={handleBet}
                    >
                        Apostar
                    </Button>
                ) : (
                    <Button variant="outlined" color="error" onClick={handleCancel}>
                        Cancelar
                    </Button>
                )}
            </div>

        </>


    );
}
