import React, { useEffect, useState } from "react";
import styles from "./Nft.module.scss";

interface Props {
    rank: string;
    className?: string;
	top?: number;
	right?: number;
}

const Nft: React.FC<Props> = ({ className, rank, top, right }) => {
	const [backgroundColor, setBackgroundColor] = useState<string>('');


	useEffect(() => {
		if (isNaN(Number(rank))) {
			setBackgroundColor('#b44949')
		} else {
			setBackgroundColor("#c0c0c0")
		}
	}, [])

    return (
        <div className={`${styles.creatorNft} ${className}`} style={{ backgroundColor, top, right }}>
            {rank}
        </div>
    );
};

export default Nft;
