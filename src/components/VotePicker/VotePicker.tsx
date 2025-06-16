import React, { useEffect, useState } from "react";
import styles from "./VotePicker.module.scss";
import { IEvent } from "../../types/types";
import { fromNano } from "@ton/ton";
import DemoVote from "../DemoVote/DemoVote";

interface Props {
    event: IEvent;
    onClick: (side: "v1" | "v2") => void;
    navigate?: () => void;
    amount?: string;
    picked?: "v1" | "v2";
    className?: string;
    setPotentialProfit?: React.Dispatch<React.SetStateAction<string | number>>;
}

const VotePicker: React.FC<Props> = ({ navigate, setPotentialProfit, className, event, amount, onClick, picked = null }) => {
    const [w1, sw1] = useState<string>("50%");
    const [w2, sw2] = useState<string>("50%");
    const [x1, sx1] = useState<string>("1.00");
    const [x2, sx2] = useState<string>("1.00");
    const [c1, sc1] = useState<number>(0);
    const [c2, sc2] = useState<number>(0);

    useEffect(() => {
        const newAmount = Number(amount ? amount : 0);
        const v1Base = Number(fromNano(event.votes.v1.collected));
        const v2Base = Number(fromNano(event.votes.v2.collected));

        const v1 = v1Base + (picked === "v1" ? newAmount : 0);
        const v2 = v2Base + (picked === "v2" ? newAmount : 0);
        const total = v1 + v2;

        const coeff1 = total > 0 ? total / v1 : 1;
        const coeff2 = total > 0 ? total / v2 : 1;

        sx1(coeff1.toFixed(2));
        sx2(coeff2.toFixed(2));

        if (setPotentialProfit) {
            if (newAmount > 0 && picked) {
                const potential = picked === "v1" ? newAmount * coeff1 - newAmount : newAmount * coeff2 - newAmount;

                setPotentialProfit(potential > 0 ? (potential + Number(amount)).toFixed(2) : 0);
            } else {
                setPotentialProfit("");
            }
        }

        sc1(v1);
        sc2(v2);

        if (event.myDemoVote) {
            const percentage1 = total > 0 ? (v1 / total) * 100 : 50;
            const percentage2 = total > 0 ? (v2 / total) * 100 : 50;

            sw1(`${Math.max(5, Math.min(95, percentage1))}%`);
            sw2(`${Math.max(5, Math.min(95, percentage2))}%`);
        } else {
            sw1("50%");
            sw2("50%");
        }
    }, [amount, event, picked, event.myDemoVote]);

    return (
        <>
            <div className={className} >
                <div className={styles.voteWrapper} onClick={navigate}>
                    <div className={styles.voteVariant} style={{ width: w1 }}>
                        <button
                            onClick={() => onClick("v1")}
                            className={styles.voteButton}
                            style={{
                                opacity: event.myDemoVote ? (picked === "v2" ? 0.4 : 1) : 0.4,

                                backgroundColor: "var(--color-vote-green)",
                            }}
                        >
                            {event.votes.v1.title}
                            {event.myDemoVote && <span> x{x1}</span>}
                        </button>
                        <p className={styles.poolsize}>
                            <span>{event.myDemoVote ? c1 : "?"}</span> TON
                        </p>
                    </div>

                    <span className={styles.vs}>vs</span>

                    <div className={styles.voteVariant} style={{ width: w2 }}>
                        <button
                            style={{
                                opacity: event.myDemoVote ? (picked === "v1" ? 0.4 : 1) : 0.4,
                                backgroundColor: "var(--color-vote-red)",
                            }}
                            onClick={() => onClick("v2")}
                            className={styles.voteButton}
                        >
                            {event.votes.v2.title}
                            {event.myDemoVote && <span> x{x2}</span>}
                        </button>
                        <p className={styles.poolsize}>
                            <span>{event.myDemoVote ? c2 : "?"}</span> TON
                        </p>
                    </div>
                </div>
            </div>
            <DemoVote event={event} />
        </>
    );
};

export default VotePicker;
