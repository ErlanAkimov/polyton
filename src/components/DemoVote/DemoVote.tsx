import React, { useEffect, useState } from "react";
import styles from "./DemoVote.module.scss";
import { IEvent } from "../../types/types";
import { authApi } from "../../api";
import { useAppDispatch } from "../../store/store";
import { setMyDemoVote } from "../../store/slices/AppSlice";

interface Props {
    event: IEvent;
}

const DemoVote: React.FC<Props> = ({ event }) => {
    const [voted, setVoted] = useState<string | null>(event.myDemoVote);
    const [v1, sv1] = useState<number>(event.demoVotes.v1);
    const [v2, sv2] = useState<number>(event.demoVotes.v2);

    const [left, setLeft] = useState<number>(50);
    const dispatch = useAppDispatch();

    const handleVote = (v: "v1" | "v2") => {
        if (voted) return;
        authApi.post(`/demoVote`, { eventId: event.id, voteType: v }).then(() => {
            dispatch(setMyDemoVote({ eventId: event.id, myDemoVote: v }));
            setVoted(v);

            if (v === "v1") {
                sv1((prev) => prev + 1);
            }

            if (v === "v2") {
                sv2((prev) => prev + 1);
            }
        });
    };

    useEffect(() => {
        const total = v1 + v2;

        if (total === 0 || !voted) {
            setLeft(50);
            return;
        }

        let percentage = (v1 / total) * 100;

        percentage = Math.max(5, Math.min(95, percentage));

        setLeft(Math.floor(percentage));
    }, [v1, v2]);

    return (
        <div className={styles.demo}>
            <p className={styles.pickerTitle}>{!voted ? "Проголосуй, чтобы увидеть:" : "Free мнение:"}</p>
            <div className={styles.progress}>
                <div
                    style={{ opacity: voted === "v2" ? 0.5 : 1 }}
                    className={styles.demoPicker}
                    onClick={() => handleVote("v1")}
                >
                    <div className={voted === "v1" ? styles.radioVoted : styles.radio} />
                    <button className={styles.demoBtn}>{event.votes.v1.title}</button>
                </div>
                <div
                    className={styles.bg}
                    style={voted ? {
                        left: left > 50 ? 0 : "initial",
                        right: left < 50 ? 0 : "initial",
                        width: `${left > 50 ? left : 100 - left}%`,
                        borderRadius: left > 50 ? "6px 6px 0 0 " : "0 6px 6px 0",
                    } : {}}
                />
                <div className={styles.line} style={{ left: `${left}%` }}>
                    <span>{voted ? (left > 50 ? left.toFixed(0) : (100 - left).toFixed(0)) : "? "}%</span>
                </div>
                <div
                    style={{ opacity: voted === "v1" ? 0.5 : 1 }}
                    className={styles.demoPicker}
                    onClick={() => handleVote("v2")}
                >
                    <button className={styles.demoBtn}>{event.votes.v2.title}</button>
                    <div className={voted === "v2" ? styles.radioVoted : styles.radio} />
                </div>
            </div>
        </div>
    );
};

export default DemoVote;
