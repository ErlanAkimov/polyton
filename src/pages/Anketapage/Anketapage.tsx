import React, { useState } from "react";
import styles from "./Anketapage.module.scss";
import copy from "copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api";

const Anketapage: React.FC = () => {
    const [tonAmount, setTonAmount] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [hash, setHash] = useState<string>("");
    const wa = window.Telegram.WebApp;
    const navigate = useNavigate();

    const handleChangeTon = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (regex.test(value)) {
            setTonAmount(value);
        } else {
            e.preventDefault();
        }
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleChangeHash = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHash(e.target.value);
    };

    const handleCopy = () => {
        copy("UQBxZ8zQJD_elmebpVA0_UxHMDS9V29ziolBdxG9NO1zF_Sa");
        wa.showAlert("Скопировано");
    };

	const handleClick = () => {
		if (!tonAmount) {
			wa.showAlert("Поле #1 не может быть пустым");
			return;
		}
		if (!hash) {
			wa.showAlert("Поле #3 не может быть пустым");
			return;
		}
		authApi
			.post("/requestToJoin", {
				tonAmount,
				text,
				hash,
			})
			.then(() => {
				navigate("/pending");
			})
			.catch(() => {
				wa.showAlert("Что-то пошло не так, попробуй позже");
			});
	};

    return (
        <div className={styles.wrapper}>
            <div className={styles.num}>1</div>
            <div className={styles.text}>Какой объем TON ты готов выделить на тесты, чтобы получить профит?</div>
            <input
                className={styles.input}
                type="text"
                placeholder="Количество TON"
                value={tonAmount}
                onChange={handleChangeTon}
            />
            <div className={styles.num}>2</div>
            <div className={styles.text}>
                Опиши событие за исход которого ты хотел бы проголосовать в первую очередь?
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder="Опишите событие, необязательно"
                value={text}
                onChange={handleChangeText}
            />
            <div className={styles.num}>3</div>
            <div className={styles.text}>
                Сейчас наш Сервис на 30 дней Арендовал Дев Токена RINS. Это значит, что мы будем отдавать приоритет для
                отбора тем, кто выкупит и отправит на кошелек дева большее количество токенов RINS. Ты можешь повысить
                вероятность одобрения своей заявки, если отправишь на этот кошелек токены:
            </div>
            <div className={styles.address} onClick={handleCopy}>
                UQBxZ8zQJD_elmebpVA0_UxHMDS9V29ziolBdxG9NO1zF_Sa
            </div>
            <div className={styles.text}>
                Помни, что мы будем рассматривать топ-100 отправителей в первую очередь, поэтому выбирай объем отправки
                с умом
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder="Ссылка на транзакцию"
                value={hash}
                onChange={handleChangeHash}
            />

			<button className={styles.send} onClick={handleClick}>Отправить</button>
        </div>
    );
};

export default Anketapage;
