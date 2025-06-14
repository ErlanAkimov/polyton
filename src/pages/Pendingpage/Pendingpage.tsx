import React from "react";
import styles from "./Pendingpage.module.scss";

const Pendingpage: React.FC = () => {
	const handleOpenSupport = () => {
		window.Telegram.WebApp.openTelegramLink('https://t.me/PMAssist')
	}
    return (
        <div className={styles.wrapper}>
            <div className={styles.modal}>
                В течение недели Служба безопасности рассмотрит твою Анкету и мы отправим тебе сообщение прямо в этом
                чате. ПОЭТОМУ РЕКОМЕНДУЕМ НЕ ВЫКЛЮЧАТЬ УВЕДОМЛЕНИЯ ОТ БОТА, ЧТОБЫ НЕ ПРОПУСТИТЬ ВАЖНУЮ ИНФОРМАЦИЮ
                <br /> Служба поддержки от команды (РМ): <span onClick={handleOpenSupport}>@PMAssist</span>
            </div>
        </div>
    );
};

export default Pendingpage;
