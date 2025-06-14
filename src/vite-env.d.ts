/// <reference types="vite/client" />

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                shareMessage: (id: string, callback: (returned: boolean) => void) => void;
                showPopup: (params: PopupParams, callback: (returned: string) => void) => void;
                showConfirm: (text: string, callback: (returned: boolean) => void) => void;
                showAlert: (text: string) => void;
                expand: () => void;
                setHeaderColor: (color: string) => void;
                setBackgroundColor: (color: string) => void;
                enableClosingConfirmation: () => void;
                onEvent: (event: string, callback: Function) => void;
                offEvent: (event: string, callback: Function) => void;
                version: string;
                initData: string;
                initDataUnsafe: any;
                platform: string;
                MainButton: BackButtonInterface;
                setBackgroundColor: (color: string) => void;
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (callback: () => void) => void;
                    offClick: () => void;
                };
                colorScheme: string;
                setHeaderColor: (color: string) => void;
                version: string;
                themeParams: {
                    bg_color: string;
                    bottom_bar_bg_color: string;
                    section_bg_color: string;
                    button_color: string;
                    header_bg_color: string;
                };
                openTelegramLink: (url: string) => void;
                addToHomeScreen: () => void;
                requestFullscreen: () => void;
                isFullscreen: boolean;
                exitFullscreen: () => void;
                checkHomeScreenStatus: (
                    callback?: (status: "unsupported" | "unknown" | "added" | "missed") => void
                ) => void;
                openTelegramLink: (url: string) => void;
                openLink: (url: string) => void;
                requestWriteAccess: (callback?: Function) => void;
                requestEmojiStatusAccess: (callback: Function) => void;
                setEmojiStatus: (
                    user_id: number,
                    emoji_status_custom_emoji_id?: string,
                    emoji_status_expiration_date?: number
                ) => void;
                disableVerticalSwipes: () => void;
            };
        };
    }
}

interface PopupParams {
    title?: string;
    message: string;
    buttons?: PopupButton[];
}

interface PopupButton {
    id: string;
    type?: "default" | "ok" | "close" | "cancel" | "destructive";
    text?: string;
}

export interface BackButtonInterface {
    type: string;
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    hasShineEffect: boolean;
    position: string;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: () => {};
    offClick: () => {};
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    hideProgress: () => void;
}
