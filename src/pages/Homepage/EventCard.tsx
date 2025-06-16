import React, { useState } from "react";
import styles from "./Homepage.module.scss";
import { IconLike, IconWallet } from "../../components/icons";
import { useNavigate } from "react-router-dom";
import { IEvent } from "../../types/types";
import VotePicker from "../../components/VotePicker/VotePicker";
import Nft from "../../components/Nft/Nft";
import { authApi } from "../../api";

const EventCard: React.FC<{ event: IEvent }> = ({ event }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState<boolean | undefined>(event.isLiked);
    const handleNavigate = () => {
        navigate(`/event/${event.id}`);
    };

    const handleLike = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        authApi.post("/like", { eventId: event.id }).then((res) => setIsLiked(res.data.isLiked));
    };

    return (
        <div className={styles.event}>
            <div onClick={handleNavigate}>
                <IconLike isLiked={isLiked} size={20} className={styles.like} onClick={handleLike} />
                <div className={styles.head}>
                    <div className={styles.imgBlock}>
                        <img src={event.image} alt="" />
                    </div>

                    <div>
                        <h3 className={styles.title}>{event.title}</h3>
                        <p className={styles.creator}>
                            <IconWallet className={styles.walletIcon} />
                            ...{event.creator.slice(44, 48)}
                        </p>

                        <Nft className={styles.nftCard} nftItem={event.creatorNft} />

                        <div className={styles.description}>
                            <span>{event.shortDescription}</span>
                        </div>
                    </div>
                </div>
            </div>
            <VotePicker event={event} onClick={() => {}} navigate={handleNavigate} />
        </div>
    );
};

export default EventCard;
