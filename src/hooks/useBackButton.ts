import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default async function useBackButton() {
    const navigate = useNavigate();

    useEffect(() => {
        const bb = window.Telegram.WebApp.BackButton;

        bb.isVisible = true;
        const getBack = () => {
            navigate(-1);
        };
        bb.onClick(getBack);

        return () => {
            bb.isVisible = false;
            bb.offClick(getBack);
        };
    }, []);
}
