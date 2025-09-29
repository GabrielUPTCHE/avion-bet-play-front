import { useState } from "react";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { getSocket } from "../utils/socket-service";

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
        <Box
            sx={{
                p: 2,
                borderTop: "1px solid #ddd",
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
                thousandSeparator="."
                decimalSeparator=","
                prefix="$"
                onValueChange={(values) => setAmount(values.floatValue ?? null)}
            />

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
        </Box>
    );
}
