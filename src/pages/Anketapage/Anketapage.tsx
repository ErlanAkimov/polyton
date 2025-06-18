import React, { useState } from "react";
import styles from "./Anketapage.module.scss";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import copy from "copy-to-clipboard";
import { setUser } from "../../store/slices/UserSlice";

const Anketapage: React.FC = () => {
    const [tonAmount, setTonAmount] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [hash, setHash] = useState<string>("");
    const wa = window.Telegram.WebApp;
    const user = useAppSelector((state) => state.user);
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

    const handleClick = () => {
        if (user.status === 3) {
            setModal(true);
            return;
        }

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
                setModal(true);
            })
            .catch(() => {
                wa.showAlert("Что-то пошло не так, попробуй позже");
            });
    };
    const [modal, setModal] = useState<boolean>(false);

    const handleCopy = () => {
        copy("@PMAssist");
    };

    const dispatch = useAppDispatch();

    const handleAcceptMe = () => {
        authApi.get("/acceptMe").then((res) => {
            dispatch(setUser(res.data.user));
            navigate("/");
        });
    };

    return (
        <div className={styles.wrapper}>
            <AnimatePresence>
                {modal && (
                    <div className={styles.modalwrapper}>
                        <motion.div
                            onClick={() => setModal(false)}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            className={styles.overlay}
                        />

                        <motion.div
                            initial={{ opacity: 0, top: 20 }}
                            exit={{ opacity: 0, top: -20 }}
                            animate={{ opacity: 1, top: 0 }}
                            className={styles.modal}
                        >
                            <div className={styles.text}>
                                <p className={styles.title}>СДЕЛАЙ СКРИН!</p>- Здесь указан контакт нашей службы заботы,
                                если вдруг тебе понадобится помощь или захочешь попасть в закрытый чат для креаторов
                                BETA, чтобы узнать как зарабатывать 5% со всей комиссии победителей пула{" "}
                                <span onClick={handleCopy}>@PMAssist</span>
                            </div>
                            <button className={styles.modalbtn} onClick={handleAcceptMe}>
                                Продолжить
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <div className={styles.num}>1</div>
            <div className={styles.text}>Какой количество TON вы хотите выделить на Голосования?</div>
            <input
                className={styles.input}
                type="text"
                placeholder="Количество TON"
                value={tonAmount}
                onChange={handleChangeTon}
            />
            <div className={styles.num}>2</div>
            <div className={styles.text}>За исход какого события вы бы хотели проголосовать Больше всего?</div>
            <input
                className={styles.input}
                type="text"
                placeholder="Опишите событие, необязательно"
                value={text}
                onChange={handleChangeText}
            />
            <div className={styles.num}>3</div>
            <div className={styles.text}>Откуда вы узнали о нашей Апке?</div>
            <div className={styles.text}>
                (кстати, у нас действует лайфтайм-рефка в 2.5% от всех профитов людей, которые пришли по ссылке от тебя.
                Просто отправь им ссылку на любой Ивент пока их не зарегал за тебя кто-то другой. Завтра о нас будет
                говорить весь TON! )
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder="Введите текст"
                value={hash}
                onChange={handleChangeHash}
            />

            <button className={styles.send} onClick={handleClick}>
                Отправить
            </button>
        </div>
    );
};

export default Anketapage;
