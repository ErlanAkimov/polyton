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
    const [left, setLeft] = useState<string>("50%");
    const dispatch = useAppDispatch();

    const handleVote = (v: "v1" | "v2") => {
        if (voted) return;
        authApi.post(`/demoVote`, { eventId: event.id, voteType: v }).then(() => {
            dispatch(setMyDemoVote({ eventId: event.id, myDemoVote: v }));
            setVoted(v);
        });
    };

    useEffect(() => {
        if (!voted || !event?.demoVotes) return;

        const { v1, v2 } = event.demoVotes;
        const total = v1 + v2;

        if (total === 0) {
            setLeft("50%");
            return;
        }

        let percentage = (v1 / total) * 100;
        percentage = Math.max(5, Math.min(95, percentage));

        setLeft(`${percentage}%`);
    }, [voted]);

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
                <div className={styles.line} style={{ left }} />
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
