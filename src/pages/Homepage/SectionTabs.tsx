import React, { useEffect } from "react";
import styles from "./Homepage.module.scss";
import { useLocation } from "react-router-dom";

interface Props {
    tab: string;
    onPickTab: (s: string) => void;
}

const SectionTabs: React.FC<Props> = ({ tab, onPickTab }) => {
    const location = useLocation();

    return (
        <div className={styles.tabwrapper}>
            <button onClick={() => onPickTab("token")} className={tab === "token" ? styles.pickedTab : styles.tab}>
                TOKENS
            </button>
            <button onClick={() => onPickTab("gift")} className={tab === "gift" ? styles.pickedTab : styles.tab}>
                GIFTS
            </button>
            <button
                onClick={() => onPickTab("activity")}
                className={tab === "activity" ? styles.pickedTab : styles.tab}
            >
                Activity
            </button>
            {tab !== "event" && (
                <button onClick={() => onPickTab("event")} className={styles.createEvent}>
                    + Event
                </button>
            )}
        </div>
    );
};

export default SectionTabs;
