import React  from "react";
import styles from "./Homepage.module.scss";

interface Props {
    tab: string;
    onPickTab: (s: string) => void;
}

const SectionTabs: React.FC<Props> = ({tab, onPickTab}) => {
    return (
        <div className={styles.tabwrapper}>
            <button onClick={() => onPickTab('token')} className={tab === 'token' ? styles.pickedTab : styles.tab}>
                TOKENS
            </button>
            <button onClick={() => onPickTab('gift')} className={tab === 'gift' ? styles.pickedTab : styles.tab}>
                GIFTS
            </button>
            <button onClick={() => onPickTab('activity')} className={tab === 'activity' ? styles.pickedTab : styles.tab}>
                Activity
            </button>
            <button onClick={() => onPickTab('event')} className={tab === 'event' ? styles.pickedTab : styles.tab}>
                + Event
            </button>
        </div>
    );
};

export default SectionTabs;
