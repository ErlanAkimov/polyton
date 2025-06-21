import React, { useEffect, useState } from "react";
import styles from "./Historypage.module.scss";
import { authApi } from "../../api";
import useBackButton from "../../hooks/useBackButton";
import { IVoteTransaction } from "../../types/types";
import { IconTon } from "../../components/icons";
import { fromNano } from "@ton/ton";

const Historypage: React.FC = () => {
    useBackButton();

    const [loading, setLoading] = useState<boolean>(true);
    const [history, setHistory] = useState<IVoteTransaction[] | null>(null);
    useEffect(() => {
        authApi.get("getHistory").then((res) => {
            setHistory(res.data.history);
            setLoading(false);
            console.log(res.data);
        });
    }, []);
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.pagetitle}>История голосований</h1>
            <div className={styles.list}>
                {loading ? (
                    <>
                        <div className={styles.skeleton} />
                        <div className={styles.skeleton} />
                        <div className={styles.skeleton} />
                    </>
                ) : (
                    history && history.map((h, i) => <HistoryItem key={i} tx={h} />)
                )}
            </div>
        </div>
    );
};

export default Historypage;

function HistoryItem({ tx }: { tx: IVoteTransaction }) {
    return (
        <div className={tx.isFinished ? styles.item : styles.itemProcess}>
            <div className={styles.inner}>
                <div className={styles.ls}>
                    <div className={styles.imgBlock}>
                        <img src={tx.vote.eventImage} alt="" />
                    </div>

                    <div>
                        <h1 className={styles.eventTitle}>{tx.vote.eventTitle}</h1>
                        {tx.vote.pickedVote === "v1" ? (
                            <p className={styles.yes}>Да</p>
                        ) : (
                            <p className={styles.no}>Нет</p>
                        )}
                    </div>
                </div>

                <div className={styles.rside}>
                    <p className={styles.date}>{formatDate(tx.vote.createdAt)}</p>
                    <p className={styles.ton}>
                        {fromNano(tx.vote.amount)}
                        <IconTon size={14} />
                    </p>
                </div>
            </div>

            {tx.isFinished && (
                <div className={styles.result}>
                    Результат:{" "}
                    {tx.isWinner ? (
                        <span style={{ color: "var(--color-history-green)" }}>
                            +{Number(fromNano(tx.winningValue || 0)).toFixed(4)} TON
                        </span>
                    ) : (
                        <span style={{ color: "var(--color-history-red)" }}>0 TON</span>
                    )}
                </div>
            )}
        </div>
    );
}

function formatDate(datestring: Date): string {
    const date = new Date(datestring);

    // Проверка на валидность даты
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}
