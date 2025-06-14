import React, { useEffect, useState } from "react";
import styles from "./VotePicker.module.scss";
import { IEvent } from "../../types/types";
import { fromNano } from "@ton/ton";
import DemoVote from "../DemoVote/DemoVote";

interface Props {
    event: IEvent;
    onClick: (side?: number) => void;
    picked?: number;
}

const VotePicker: React.FC<Props> = ({ event, onClick, picked }) => {
    const [w1, sw1] = useState<string>("100%");
    const [w2, sw2] = useState<string>("100%");

    useEffect(() => {
        function calculateWidths() {
            const collected1 = Number(event.votes.v1.collected);
            const collected2 = Number(event.votes.v2.collected);
            const total = collected1 + collected2;

            const rate1 = collected1 / total;
            const rate2 = collected2 / total;

            sw1(`${(rate1 * 100).toString()}%`);
            sw2(`${(rate2 * 100).toString()}%`);
        }

        calculateWidths();
    }, []);

    return (
        <>
            <div className={styles.voteWrapper}>
                <div className={styles.voteVariant} style={{ width: w1 }}>
                    <button
                        onClick={() => onClick(0)}
                        className={styles.voteButton}
                        style={{
                            opacity: picked === undefined || picked === 0 ? 1 : 0.4,
                            backgroundColor: "var(--color-vote-green)",
                        }}
                    >
                        {event.votes.v1.title}{" "}
                        {Number(event.votes.v1.collected) > 0 && (
                            <span>
                                x
                                {(
                                    Number(fromNano(event.votes.v2.collected)) /
                                        Number(fromNano(event.votes.v1.collected)) +
                                    1
                                ).toFixed(2)}
                            </span>
                        )}
                    </button>
                    <p className={styles.poolsize}>
                        пул <span>{fromNano(event.votes.v1.collected)} </span> TON
                    </p>
                </div>
                <span className={styles.vs}>vs</span>
                <div className={styles.voteVariant} style={{ width: w2 }}>
                    <button
                        style={{
                            opacity: picked === undefined || picked === 1 ? 1 : 0.4,
                            backgroundColor: "var(--color-vote-red)",
                        }}
                        onClick={() => onClick(1)}
                        className={styles.voteButton}
                    >
                        {event.votes.v2.title}{" "}
                        {Number(event.votes.v1.collected) > 0 && (
                            <span>
                                x
                                {(
                                    Number(fromNano(event.votes.v1.collected)) /
                                        Number(fromNano(event.votes.v2.collected)) +
                                    1
                                ).toFixed(2)}
                            </span>
                        )}
                    </button>
                    <p className={styles.poolsize}>
                        пул <span>{fromNano(event.votes.v2.collected)} </span> TON
                    </p>
                </div>
            </div>

			{/* <DemoVote event={event} /> */}
        </>
    );
};

export default VotePicker;
