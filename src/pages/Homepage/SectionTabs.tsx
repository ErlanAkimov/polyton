import React from "react";
import styles from "./Homepage.module.scss";

interface Props {
    tab: string;
    onPickTab: (s: string) => void;
}

const SectionTabs: React.FC<Props> = ({ tab, onPickTab }) => {
    return (
        <div className={styles.tabwrapper}>
            <button onClick={() => onPickTab("activity")} className={tab === "activity" ? styles.pickedTab : styles.tab}>
                Activity
            </button>
            <button onClick={() => onPickTab("token")} className={tab === "token" ? styles.pickedTab : styles.tab}>
                TOKEN
            </button>
            <button
                onClick={() => onPickTab("gift")}
                className={tab === "gift" ? styles.pickedTab : styles.tab}
            >
                GIFT
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
