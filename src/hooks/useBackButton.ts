import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default async function useBackButton() {
    const navigate = useNavigate();

    useEffect(() => {
        const bb = window.Telegram.WebApp.BackButton;

        bb.isVisible = true;
        bb.onClick(() => navigate(-1));

        return () => {
            bb.isVisible = false;
        };
    }, []);
}
