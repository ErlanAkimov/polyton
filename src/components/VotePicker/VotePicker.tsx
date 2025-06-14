import React, { useEffect, useState } from "react";
import styles from "./VotePicker.module.scss";
import { IEvent } from "../../types/types";
import { fromNano } from "@ton/ton";
import DemoVote from "../DemoVote/DemoVote";
import { useAppSelector } from "../../store/store";

interface Props {
    event: IEvent;
    onClick: (side: "v1" | "v2") => void;
    amount?: string;
    picked?: "v1" | "v2";
    className?: string
}

const VotePicker: React.FC<Props> = ({ className, event, amount, onClick, picked = null }) => {
    const [w1, sw1] = useState<string>("100%");
    const [w2, sw2] = useState<string>("100%");

    const [x1, sx1] = useState<string | number>();
    const [x2, sx2] = useState<string | number>();

    const [c1, sc1] = useState<number>(Number(fromNano(event.votes.v1.collected)));
    const [c2, sc2] = useState<number>(Number(fromNano(event.votes.v1.collected)));

    useEffect(() => {
        const newAmount = Number(amount ? amount : 0);
        const total =
            Number(fromNano(event.votes.v1.collected)) + Number(fromNano(event.votes.v2.collected)) + newAmount;
        const v1 = Number(fromNano(event.votes.v1.collected)) + (picked === "v1" ? newAmount : 0);
        const v2 = Number(fromNano(event.votes.v2.collected)) + (picked === "v2" ? newAmount : 0);

        sx1((total / v1).toFixed(2));
        sx2((total / v2).toFixed(2));

        sc1(v1);
        sc2(v2);

        
        if (!event.myDemoVote) return;
        sw1(`${((v1 / total) * 100).toString()}%`);
        sw2(`${((v2 / total) * 100).toString()}%`);
    }, [amount, event, picked]);

    return (
        <div className={className}>
            <div className={styles.voteWrapper}>
                <div className={styles.voteVariant} style={{ width: w1 }}>
                    <button
                        onClick={() => onClick("v1")}
                        className={styles.voteButton}
                        style={{
                            opacity: picked === "v2" ? 0.4 : 1,
                            backgroundColor: "var(--color-vote-green)",
                        }}
                    >
                        {event.votes.v1.title} {Number(event.votes.v1.collected) > 0 && event.myDemoVote && <span>x{x1}</span>}
                    </button>
                    <p className={styles.poolsize}>
                        
                        <span>{event.myDemoVote ? c1 : "?"}</span> TON
                    </p>
                </div>
                <span className={styles.vs}>vs</span>
                <div className={styles.voteVariant} style={{ width: w2 }}>
                    <button
                        style={{
                            opacity: picked === "v1" ? 0.4 : 1,
                            backgroundColor: "var(--color-vote-red)",
                        }}
                        onClick={() => onClick("v2")}
                        className={styles.voteButton}
                    >
                        {event.votes.v2.title} {Number(event.votes.v1.collected) > 0 && event.myDemoVote && <span>x{x2}</span>}
                    </button>
                    <p className={styles.poolsize}>
                        <span>{event.myDemoVote ? c2 : "?"}</span> TON
                    </p>
                </div>
            </div>

            <DemoVote event={event} />
        </div>
    );
};

export default VotePicker;
