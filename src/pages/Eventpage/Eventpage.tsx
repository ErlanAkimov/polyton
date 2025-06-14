import React, { useEffect, useState } from "react";
import styles from "./Eventpage.module.scss";
import { IEvent } from "../../types/types";
import { api } from "../../api";
import { useParams } from "react-router-dom";
import useBackButton from "../../hooks/useBackButton";
import { IconShare, IconWallet } from "../../components/icons";
import { motion } from "motion/react";
import VotePicker from "../../components/VotePicker/VotePicker";
import useBottomButton from "../../hooks/useBottomButton";
import { fromNano } from "@ton/ton";
import Nft from "../../components/Nft/Nft";
import FullDescription from "./FullDescription";

const Eventpage: React.FC = () => {
    const [event, setEvent] = useState<IEvent | null>(null);
    const { eventId } = useParams();

    const [amount, setAmount] = useState<string>("");
    const [pickedVote, setPickedVote] = useState<number>(0);

    const handleVote = () => {};

    useBackButton();
    useBottomButton("Создать ордер", handleVote);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (regex.test(value)) {
            setAmount(value);
        } else {
            e.preventDefault();
        }
    };

    const handleStepValue = (v: string) => {
        if (v === "+") {
            setAmount((prev) => (Number(prev) + 0.5).toString());
        } else {
            const result = Number(amount) - 0.5 < 0 ? "0" : (Number(amount) - 0.5).toFixed(2);
            setAmount(result);
        }
    };

    useEffect(() => {
        if (!event) {
            api.get(`/getEvent?eventId=${eventId}`).then((res) => setEvent(res.data.event));
            return;
        }
    }, []);

    const handleShare = () => {
        window.Telegram.WebApp.openTelegramLink(
            `https://t.me/share/url?url=https://t.me/${import.meta.env.VITE_BOT_NAME}?startapp=event_${eventId}-ref_${window.Telegram.WebApp.initDataUnsafe.user.id}`
        );
    };

    const handlePickVote = (number?: number) => {
        if (number !== undefined) {
            setPickedVote(number);
        }
    };

    return (
        <div className={styles.wrapper}>
            {event && (
                <div>
                    <div className={styles.info}>
                        <div className={styles.imgSide}>
                            <div className={styles.imageBlock}>
                                <img src={event.image} alt="" />
                            </div>

                            <Nft rank={event.creator_nft.rank} />

                            <button className={styles.share} onClick={handleShare}>
                                <IconShare /> Share
                            </button>
                        </div>

                        <div className={styles.infoContent}>
                            <div>
                                <h1 className={styles.title}>{event.title}</h1>
                                <p className={styles.creator}>
                                    <IconWallet className={styles.walletIcon} />
                                    ...{event.creator.slice(44, 48)}
                                </p>
                            </div>

                            <FullDescription
                                description={event.description}
                                shortDescription={event.shortDescription}
                            />
                        </div>
                    </div>

                    <div className={styles.inputBlock}>
                        <input placeholder="0.5 min" value={amount} onChange={handleChangeInput} type="text" />
                        <motion.button onClick={() => handleStepValue("+")} whileTap={{ scale: 0.92 }}>
                            +
                        </motion.button>
                        <motion.button onClick={() => handleStepValue("-")} whileTap={{ scale: 0.92 }}>
                            -
                        </motion.button>
                    </div>

                    <div className={styles.picker}>
                        <p className={styles.pickerTitle}>Выбери прогноз события</p>
                        <VotePicker picked={pickedVote} event={event} onClick={handlePickVote} />
                    </div>

                    {/* <DemoVote event={event} setUnlockVote={setVoteUnlocked} /> */}

                    <div className={styles.lore}>
                        {!amount || Number(amount) === 0 ? (
                            <p className={styles.loretitle}>
                                Здесь будет отображен ваш потенциальный профит, при позитвном исходе голосования.Введите
                                сумму ордера и выбирите вариант голосования
                            </p>
                        ) : (
                            <p className={styles.loretitle}>
                                Ваша потенциальная прибыль составит{" "}
                                {(
                                    Number(amount) *
                                    (Number(fromNano(event.votes[pickedVote === 0 ? "v1" : "v2"].collected)) /
                                        Number(fromNano(event.votes[pickedVote === 0 ? "v2" : "v1"].collected)) +
                                        1)
                                ).toFixed(2)}{" "}
                                TON, текущие коэффициенты меняются с учетом новых голосов
                            </p>
                        )}

                        <div className={styles.loretext}>
                            * Пул проигравших распределяется равномерно на пул победителей, итоговый профит будет
                            пересчитан после завершения события.
                        </div>

                        <div className={styles.loretext}>
                            <ul className={styles.numberedList}>
                                <li>Вы голосуете 10 TON за «ДА» рассчитывая на коэффициент Х2.25.</li>
                                <li>В момент вашего голоса Пулы были 40 и 50 TON соответственно на «ДА и НЕТ».</li>
                                <li>
                                    После вашей ставки коэффициент изменился на 2Х. Ваша доля от Пула в случае победы
                                    20%.
                                </li>
                                <li>
                                    К завершению голосования люди добавили в пул «НЕТ» дополнительные 50 TON. Пул в «ДА»
                                    остался без изменений. Ваша доля по-прежнему 20%.
                                </li>
                                <li>
                                    Это значит, что вы получите 20% от пула проигравших 100 TON. Ваш профит составит 20
                                    TON и итоговый коэффициент 3х.
                                </li>
                                <li>
                                    Далее мы вычитаем комиссию от профита за сервис (5% Создателю ивента и 5% POLYTON).
                                </li>
                                <li>Вы получаете +18 TON профита на голос в 10 TON.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Eventpage;
