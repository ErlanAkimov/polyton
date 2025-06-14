import React, { useEffect, useState } from "react";
import styles from "./DemoVote.module.scss";
import { IEvent } from "../../types/types";
import { authApi } from "../../api";

interface Props {
    event: IEvent;
    setUnlockVote: React.Dispatch<React.SetStateAction<boolean>>;
}

const DemoVote: React.FC<Props> = ({ event, setUnlockVote }) => {
    const [voted, setVoted] = useState<string>("");
    useEffect(() => {
        authApi.get(`/getDemoVote?eventId=${event.id}`).then((res) => {
            if (res.data.vote) {
                setUnlockVote(true);
                setVoted(res.data.vote.voteType);
            }
        });
    }, []);

    const handleVote = (v: string) => {
        if (voted) return;
        authApi.post(`/demoVote`, { eventId: event.id, voteType: v });
        setUnlockVote(true);
        setVoted(v);
    };
    return (
        <div className={styles.demo}>
            <p className={styles.pickerTitle}>Голосуй в формате DEMO</p>
            <div className={styles.progress}>
                <div style={{opacity: voted === 'v2' ? .5 : 1}} className={styles.demoPicker} onClick={() => handleVote("v1")}>
                    <div className={voted === "v1" ? styles.radioVoted : styles.radio} />
                    <button className={styles.demoBtn}>{event.votes.v1.title}</button>
                </div>
                <div className={styles.line} />
                <div style={{opacity: voted === 'v1' ? .5 : 1}} className={styles.demoPicker} onClick={() => handleVote("v2")}>
                    <button className={styles.demoBtn}>{event.votes.v2.title}</button>
                    <div className={voted === "v2" ? styles.radioVoted : styles.radio} />
                </div>
            </div>
        </div>
    );
};

export default DemoVote;
