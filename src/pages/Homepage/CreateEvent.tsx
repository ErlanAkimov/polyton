import React, { useEffect, useState } from "react";
import styles from "./CreateEvent.module.scss";
import { authApi } from "../../api";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/ton";

const CreateEvent: React.FC = () => {
    const [token, setToken] = useState<string>("kQDIcbBNq-lXVu-Eg9mmjkwv8LlVjUqvr1hcwi8oqcFSh0dy");
    const [mcap, setMcap] = useState<string>("2000");
    const [expDate, setExpDate] = useState<string>("5");
    const [liquidity, setLiquidity] = useState<string>("120");
    const [result, setResult] = useState<string>("v1");

    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();

	
    const handleSend = () => {
		if (!wallet) {
			tc.openModal();
            return;
        }
		
        try {
			Address.parse(token);
        } catch {
			window.Telegram.WebApp.showAlert("Введите корректный адрес токена");
            return;
        }
		
        if (Number(expDate) < 0.5 || Number(expDate) > 6) {
			window.Telegram.WebApp.showAlert("Временной диапазон должен быть от 0.5 до 6");
            return;
        }
		
        authApi
		.post("/createEvent", {
			creator: wallet.account.address,
			token,
			expDate: Date.now() + Number(expDate) * 1000 * 60 * 60,
			mcap,
			position: liquidity,
			result,
		})
		.then((res) => {
			tc.sendTransaction(res.data.transaction)
			.then(() => {
				window.Telegram.WebApp.showPopup({
					title: "Транзакция в обработке",
					message:
					"Вы создали Голосование! Через пару минут оно будет в поиске. Хотите рассказать о вашем Ивенте?",
					buttons: [
						{ text: "Закрыть", type: "destructive", id: "ok" },
						{
							text: "Поделиться",
							type: "default",
							id: `share:${"e1e726366a07d8009b88847d243e20a7"}`,
						},
					],
				});
			})
			.catch(() => {});
		});
    };
	
	// window.Telegram.WebApp.showAlert(Address.parse(wallet?.account.address!).toString({bounceable: false}));
    const handleChangeToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToken(e.target.value);
    };

    const handleChangeMcap = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMcap(e.target.value);
    };
    const handleChangeExpDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpDate(e.target.value);
    };
    const handleChangeLiquidity = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLiquidity(e.target.value);
    };

    const handlePickResult = (s: string) => {
        setResult(s);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Запустить голосование</div>
            <div className={styles.disclaimer}>
                Создатели получают 5% от суммарного профита Пула победителей в голосовании. Так что создавай и
                рекламируй события с умом.
            </div>

            <Input
                value={token}
                onChange={handleChangeToken}
                title="Адрес токена"
                placeholder="EQ..."
                text="На какой токен хотите создать прогноз?"
            />
            <Input
                value={mcap}
                onChange={handleChangeMcap}
                title="Цена Mcap в $"
                placeholder="Например: 20000"
                text="Введите Капу, от которой хотите строить прогноз"
            />
            <Input
                value={expDate}
                onChange={handleChangeExpDate}
                title="Дата завершения"
                placeholder="Например: 5"
                text="Введите цифру от 0.5 до 6 (это количество часов, по истечению которых завершится голосование)"
            />
            <Input
                value={liquidity}
                onChange={handleChangeLiquidity}
                title="Ликвидность пула"
                placeholder="Минимум (TON): 10"
                text=""
            />

            <h3 className={styles.inputTitle}>Исход события</h3>
            <div className={styles.picker}>
                <button
                    onClick={() => handlePickResult("v1")}
                    className={result === "v1" ? styles.pickedBtn : styles.pickBtn}
                    style={{ backgroundColor: "var(--color-vote-green)" }}
                >
                    Выше
                </button>
                <button
                    onClick={() => handlePickResult("v2")}
                    className={result === "v2" ? styles.pickedBtn : styles.pickBtn}
                    style={{ backgroundColor: "var(--color-vote-red)" }}
                >
                    Ниже
                </button>
            </div>
            <p className={styles.inputDescription}>Выбери исход значения MCap (Выше или Ниже указанного значения)</p>

            <button onClick={handleSend} className={styles.send}>
                Отправить
            </button>
        </div>
    );
};

export default CreateEvent;

function Input({
    value,
    onChange,
    title,
    placeholder,
    text,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    text: string;
    title: string;
    placeholder: string;
}) {
    return (
        <div className={styles.block}>
            <h3 className={styles.inputTitle}>{title}</h3>
            <input type="text" placeholder={placeholder} value={value} className={styles.input} onChange={onChange} />
            <p className={styles.inputDescription}>{text}</p>
        </div>
    );
}
