import { useState, useEffect } from "react";
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
    const [lastProfit, setLastProfit] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(10500);
    const [currentBetAmount, setCurrentBetAmount] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false); // Estado para saber si la ronda está activa
    
    const socket = getSocket();

    useEffect(() => {
        if (!socket) return;

        // Escuchar cuando inicia la ronda
        const handleRoundStart = () => {
            console.log("🎮 Ronda iniciada");
            setIsRunning(true);
        };

        // Escuchar cuando termina la ronda
        const handleRoundEnd = (payload: any) => {
            console.log("💰 Round End recibido:", payload);
            setIsRunning(false);
            
            const { playerEarnings } = payload;
            
            // Buscar las ganancias del jugador actual
            if (playerEarnings && socket.id) {
                const myEarnings = playerEarnings.find(
                    (e: any) => e.id_player === socket.id
                );
                
                if (myEarnings) {
                    console.log("✅ Mis ganancias:", myEarnings);
                    
                    // Actualizar la última ganancia/pérdida
                    setLastProfit(myEarnings.profit);
                    
                    // Actualizar el saldo total
                    setTotalBalance(prev => prev + myEarnings.profit);
                    
                    // Resetear la apuesta
                    setHasBet(false);
                    setCurrentBetAmount(0);
                } else {
                    console.log("ℹ️ No tenía apuesta en esta ronda");
                }
            }
        };

        // Escuchar confirmación de apuesta
        const handleBetConfirmed = (data: any) => {
            console.log("✅ Apuesta confirmada:", data);
            setCurrentBetAmount(data.amount);
        };

        // Escuchar cash out exitoso
        const handleCashOutSuccess = (data: any) => {
            console.log("💵 Cash out exitoso:", data);
            
            // Actualizar la última ganancia
            setLastProfit(data.profit);
            
            // Actualizar el saldo total
            setTotalBalance(prev => prev + data.profit);
            
            // Resetear la apuesta
            setHasBet(false);
            setCurrentBetAmount(0);
        };

        socket.on("round_start", handleRoundStart);
        socket.on("round_end", handleRoundEnd);
        socket.on("bet_confirmed", handleBetConfirmed);
        socket.on("cash_out_success", handleCashOutSuccess);

        return () => {
            socket.off("round_start", handleRoundStart);
            socket.off("round_end", handleRoundEnd);
            socket.off("bet_confirmed", handleBetConfirmed);
            socket.off("cash_out_success", handleCashOutSuccess);
        };
    }, [socket]);

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
        
        // Si hay una ronda activa, hacer cash out
        // Si no, cancelar la apuesta antes de que inicie
        if (isRunning) {
            console.log('💵 Retirando ganancia:', socket.id);
            socket.emit("cash_out", { id_player: socket.id });
        } else {
            console.log('❌ Cancelando apuesta:', socket.id);
            socket.emit("cancel_bet", { id_player: socket.id });
        }
        
        setHasBet(false);
        setAmount(null);
        setCurrentBetAmount(0);
    };

    // Función auxiliar para formatear moneda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(value);
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
                            <div className="stat-value saldo">
                                {formatCurrency(totalBalance)}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">
                                {lastProfit >= 0 ? 'Ganancia Última Ronda' : 'Pérdida Última Ronda'}
                            </div>
                            <div 
                                className={`stat-value ${lastProfit >= 0 ? 'ganancia' : 'perdida'}`}
                                style={{ 
                                    color: lastProfit >= 0 ? '#4caf50' : '#f44336' 
                                }}
                            >
                                {lastProfit >= 0 ? '+' : ''}{formatCurrency(lastProfit)}
                            </div>
                        </div>
                    </div>
                    
                    {hasBet && currentBetAmount > 0 && (
                        <div style={{ 
                            marginTop: '10px', 
                            padding: '10px', 
                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                            borderRadius: '5px',
                            textAlign: 'center'
                        }}>
                            <small>Apuesta activa: {formatCurrency(currentBetAmount)}</small>
                        </div>
                    )}
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
                    <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleCancel}
                    >
                        {isRunning ? 'Retirar' : 'Cancelar'}
                    </Button>
                )}
            </div>
        </>
    );
}