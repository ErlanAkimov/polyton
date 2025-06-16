import React from "react";
import styles from "./Nft.module.scss";
import { ICreatorNft } from "../../types/types";

interface Props {
    nftItem: ICreatorNft;
    className: string;
}

const colors = ["#B1B1B1", "#F09967", "#A52A2A"];

const Nft: React.FC<Props> = ({ className, nftItem }) => {
    return (
        <div className={`${styles.creatorNft} ${className}`} style={{ backgroundColor: colors[nftItem.collection] }}>
            {nftItem.symbol}
        </div>
    );
};

export default Nft;
