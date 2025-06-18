import React, { useEffect, useState } from "react";
import styles from "./Historypage.module.scss";
import { authApi } from "../../api";
import useBackButton from "../../hooks/useBackButton";

const Historypage: React.FC = () => {
    useBackButton();

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
		return;
        authApi.get("getHistory").then((res) => {
            setLoading(false);
            console.log(res.data);
        });
    }, []);
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.pagetitle}>История голосований</h1>

            <div className={styles.dev}>
                <p className={styles.text}>Данный раздел находится в разработке и станет доступен в ближайшие дни</p>
            </div>

            <div className={styles.list}>
                {loading ? (
                    <>
                        {/* <div className={styles.skeleton} />
                        <div className={styles.skeleton} />
                        <div className={styles.skeleton} /> */}
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default Historypage;
