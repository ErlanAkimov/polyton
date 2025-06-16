import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";

export default function () {
    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();

    useEffect(() => {
        if (!wallet) return;

        if (wallet.account.chain === "-3" && !import.meta.env.DEV) {
            window.Telegram.WebApp.showAlert("Wallet disconnected: Testnet is not support.");
            tc.disconnect();
        }
    }, [wallet]);
}
