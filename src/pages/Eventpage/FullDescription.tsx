import React, { useRef, useState } from "react";
import styles from "./Eventpage.module.scss";

interface Props {
    description: string;
    shortDescription: string;
}

const FullDescription: React.FC<Props> = ({ description, shortDescription }) => {
    const [maxHeight, setMaxHeight] = useState<number>(54);
    const ref = useRef<HTMLDivElement>(null);

    const handleShow = () => {
        if (maxHeight === 54) {

            setMaxHeight(ref.current?.scrollHeight!);
        } else {
            setMaxHeight(54);
        }
    };

    return (
        <div className={styles.descriptionWrapper}>
            <div ref={ref} className={styles.inner} style={{ maxHeight }}>
                <p className={styles.description}>{shortDescription}</p>
                <p className={styles.description}>{description}</p>
            </div>
            <button className={styles.showDescriptionButton} onClick={handleShow}>
                {maxHeight === 54 ? "Показать полностью" : "Свернуть"}
            </button>
        </div>
    );
};

export default FullDescription;
