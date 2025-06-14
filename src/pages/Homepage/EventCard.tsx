import React from "react";
import styles from "./Homepage.module.scss";
import { IconLike, IconWallet } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { IEvent } from "../../types/types";
import VotePicker from "../../components/VotePicker/VotePicker";
import Nft from "../../components/Nft/Nft";

const EventCard: React.FC<{ event: IEvent }> = ({ event }) => {
    const navigate = useNavigate();
    const handleOpenKeyboard = () => {
        navigate(`/event/${event.id}`);
    };

    return (
        <div className={styles.event}>
            <IconLike size={20} className={styles.like} />
            <div className={styles.head}>
                <div className={styles.imgBlock}>
                    <img src={event.image} alt="" />
                </div>

                <div>
                    <h3 className={styles.title}>{event.title}</h3>
                    <p className={styles.creator}>
                        <IconWallet className={styles.walletIcon} />...{event.creator.slice(44, 48)}
                    </p>

                    <Nft rank={event.creator_nft.rank} top={10} right={14} />

                    <div className={styles.description}>
                        <span>{event.shortDescription}</span>
                    </div>
                </div>
            </div>

            <VotePicker event={event} onClick={handleOpenKeyboard} />
        </div>
    );
};

export default EventCard;
