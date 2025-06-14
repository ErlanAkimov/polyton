import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.scss";
import { BrowserRouter } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Provider } from "react-redux";
import store from "./store/store.ts";

const wa = window.Telegram.WebApp;
const isDesktop = ["tdesktop", "unknown"].includes(wa.platform);

if (!isDesktop) {
    wa.requestFullscreen();
    wa.disableVerticalSwipes();
    wa.expand();
}
wa.setHeaderColor("#171717");

createRoot(document.getElementById("root")!).render(
        <Provider store={store}>
            <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ZET2000/pol/refs/heads/main/tonconnect-manifest.json">
                <BrowserRouter>
                    <div className={isDesktop ? "is_desktop" : "is_tma"}>
                        <App />
                    </div>
                </BrowserRouter>
            </TonConnectUIProvider>
        </Provider>
);
