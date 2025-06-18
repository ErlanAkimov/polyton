import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { IconClock, IconLogout, IconTon, IconWallet } from "../icons";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { toncenter } from "../../api";
import { fromNano } from "@ton/ton";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
const Header: React.FC = () => {
    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();
    const [balance, setBalance] = useState<string | null>(null);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!wallet) return;
        toncenter
            .get(`/walletInformation?address=${wallet.account.address}`)
            .then((res) => setBalance(Number(fromNano(res.data.balance)).toFixed(2)));
    }, [wallet]);

    const handleOpenMenu = () => {
        setMenuIsOpen((prev) => !prev);
    };

    const handleWallet = () => {
        if (!wallet) {
            tc.openModal();
        } else {
            tc.disconnect();
        }
        setMenuIsOpen(false);
    };

    const handleNavigate = (link: string) => {
        setMenuIsOpen(false);
        navigate(link);
    };

    return (
        <>
            <div
                className={styles.wrapper}
                style={{ paddingTop: ["unknown", "tdesktop"].includes(window.Telegram.WebApp.platform) ? 10 : "" }}
            >
                <h1 onClick={() => handleNavigate('/')}>polyton</h1>

                <div className={styles.rside}>
                    {wallet && (
                        <div className={styles.headerBtns}>
                            <div className={styles.balance}>
                                <span>{balance && balance}</span>
                                <IconTon size={16} />
                            </div>
                        </div>
                    )}

                    <motion.div onClick={handleOpenMenu} whileTap={{ scale: 0.95 }} className={styles.menuBtn}>
                        <div className={styles.menuLine} />
                        <div className={styles.menuLine} />
                    </motion.div>
                </div>
            </div>
            <AnimatePresence>
                {menuIsOpen && (
                    <motion.div
                        onClick={handleOpenMenu}
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    ></motion.div>
                )}

                {menuIsOpen && (
                    <motion.div
                        className={styles.menu}
                        initial={{ right: 0, opacity: 0 }}
                        animate={{ right: 16, opacity: 1 }}
                        exit={{ right: 32, opacity: 0 }}
                    >
                        <motion.div
                            className={styles.menuElement}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNavigate("/history")}
                        >
                            <IconClock />
                            <button>История</button>
                        </motion.div>

                        {wallet ? (
                            <motion.div
                                className={styles.logoutMenuElement}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleWallet}
                            >
                                <IconLogout className={styles.logoutIcon} />
                                <button>Disconnect</button>
                            </motion.div>
                        ) : (
                            <motion.div
                                className={styles.menuElement}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleWallet}
                            >
                                <IconWallet />
                                <button>Connect Wallet</button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
