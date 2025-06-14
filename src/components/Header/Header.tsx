import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { IconTon } from "../icons";
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import { toncenter } from "../../api";
import { fromNano } from "@ton/ton";

const Header: React.FC = () => {
    const wallet = useTonWallet();
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        if (!wallet) return;
        toncenter
            .get(`/walletInformation?address=${wallet.account.address}`)
            .then((res) => setBalance(Number(fromNano(res.data.balance)).toFixed(2)));
    }, [wallet]);

    return (
        <div
            className={styles.wrapper}
            style={{ paddingTop: ["unknown", "tdesktop"].includes(window.Telegram.WebApp.platform) ? 10 : "" }}
        >
            <h1>polyton</h1>

            <div className={styles.rside}>
                {wallet ? (
                    <div className={styles.balance}>
                        <span>{balance && balance}</span>
                        <IconTon size={16} />
                    </div>
                ) : (
                    <></>
                )}
                <TonConnectButton />
            </div>
        </div>
    );
};

export default Header;
