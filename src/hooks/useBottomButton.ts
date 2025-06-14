import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";

export default function useBottomButton(text: string, onClick: () => void) {
    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();

    useEffect(() => {
        const wa = window.Telegram.WebApp;
        wa.MainButton.show();
        wa.setBottomBarColor("#171717");
        wa.MainButton.setText(wallet ? text : "Подключить кошелек");

        if (!wallet) {
            wa.MainButton.onClick(() => tc.openModal());
        } else {
            wa.MainButton.onClick(onClick);
        }

        return () => {
            wa.MainButton.offClick(onClick);
            wa.MainButton.hide();
        };
    }, [wallet]);
}
