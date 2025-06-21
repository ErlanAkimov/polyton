import React, { useEffect, useState } from "react";
import styles from "./Adminpage.module.scss";
import { useAppSelector } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { authApi } from "../../api";
import { IEvent } from "../../types/types";
import { fromNano } from "@ton/ton";

const Adminpage: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.status !== null && user.status !== 0) {
            navigate("/");
            return;
        }
    }, [user]);

    const handleNavigate = (link: string) => {
        navigate(link);
    };

    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        authApi.get("/getEventsAdmin").then((res) => setEvents(res.data.events));
    }, []);

    const [eventInModal, setEventInModal] = useState<IEvent | null>(null);

    return (
        <div className={styles.wrapper}>
            <div className={styles.tabs}>
                <motion.div
                    onClick={() => handleNavigate("/admin/create-event")}
                    whileTap={{ scale: 0.9 }}
                    className={styles.gridItem}
                >
                    <h1 className={styles.tabTitle}>Создать event</h1>
                </motion.div>
            </div>

            <h2 className={styles.title}>События</h2>

            <AnimatePresence>
                {eventInModal && (
                    <div className={styles.modalWrapper}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.overlay}
                            onClick={() => setEventInModal(null)}
                        />

                        <EventModal setEvents={setEvents} setModal={setEventInModal} event={eventInModal} />
                    </div>
                )}
            </AnimatePresence>

            <div className={styles.list}>
                {events.length && events.map((e, i) => <Event setToModal={setEventInModal} event={e} key={i} />)}
            </div>
        </div>
    );
};

export default Adminpage;

function EventModal({
    event,
    setModal,
    setEvents,
}: {
    setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
    event: IEvent;
    setModal: React.Dispatch<React.SetStateAction<IEvent | null>>;
}) {
    const realv1 = Number(fromNano(Number(event.votes.v1.collected) - Number(event.startV1 || 0)));
    const realv2 = Number(fromNano(Number(event.votes.v2.collected) - Number(event.startV2 || 0)));
    const realTotal = realv1 + realv2;

    const startv1 = Number(fromNano(event.startV1 || 0));
    const startv2 = Number(fromNano(event.startV2 || 0));
    const startTotal = startv1 + startv2;

    const [current1, setCurrent1] = useState<number>(realv1 + startv1);
    const [current2, setCurrent2] = useState<number>(realv2 + startv2);
    const [currentTotal, setCurrentTotal] = useState<number>(realTotal + startTotal);

    const [i1, si1] = useState<string>("");
    const [i2, si2] = useState<string>("");

    useEffect(() => {
        setCurrent1(realv1 + startv1 + Number(i1));
        setCurrentTotal(realTotal + startTotal + Number(i1));
    }, [i1]);

    useEffect(() => {
        setCurrent2(realv2 + startv2 + Number(i2));
        setCurrentTotal(realTotal + startTotal + Number(i2));
    }, [i2]);

    const handleChangeV1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (Number(value) > 999999) {
            return;
        }

        if (regex.test(value)) {
            si1(value);
        } else {
            e.preventDefault();
        }
    };
    const handleChangeV2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^\d*\.?\d*$/;

        if (Number(value) > 999999) {
            return;
        }

        if (regex.test(value)) {
            si2(value);
        } else {
            e.preventDefault();
        }
    };

    const showAlert = (text: string) => {
        window.Telegram.WebApp.showAlert(text);
    };

    const handleChangeStatus = () => {
        if (event.status === "finished" || event.status === "over") {
            showAlert("Нельзя вернуть голосование после завершения");
            return;
        }

        const newStatus = event.status === "active" ? "hidden" : "active";

        authApi
            .post(`/changeEventStatus`, {
                eventId: event.id,
                status: newStatus,
            })
            .then((res) => {
                if (res.data === "OK") {
                    showAlert("Статус изменен");
                    setEvents((prev) => prev.map((ev) => (ev.id === event.id ? { ...ev, status: newStatus } : ev)));
                    setModal(null);
                }
            });
    };

    const handleUpdateStartValue = () => {
        if (!i1 && !i2) {
            showAlert("Нужно заполнить хотя бы одно поле");
            return;
        }

        authApi
            .post("/updateStartValue", {
                eventId: event.id,
                i1,
                i2,
            })
            .then(() => {
                setModal(null);
                showAlert("Пул успешно обновлен. Новые значения будут доступны после обновления страницы");
            })
            .catch(() => showAlert("Что то пошло не так. Сервер не смог обработать запрос"));
    };

    const handleFinish = () => {
        window.Telegram.WebApp.showPopup({
            title: "Завершение голосования",
            message:
                "Событие будет завершено затем будут произведены выплаты. Отменить это действие не получится. Выберите сторону победителя?",
            buttons: [
                { text: "Победа ДА", type: "default", id: `finish-${event.id}-v1` },
                { text: "Победа НЕТ", type: "default", id: `finish-${event.id}-v2` },
                { text: "Отменить", type: "destructive", id: "return" },
            ],
        });
    };

    useEffect(() => {
        const sendFinishTrigger = (c: PopupClosedCallback) => {
            // @ts-ignore
            const text = c.button_id;

            if (text.startsWith("finish")) {
                authApi
                    .post("/finishEvent", {
                        eventId: text.split("-")[1],
                        winner: text.split("-")[2],
                    })
                    .then((res) => {
                        if (res.data.startsWith('Wallet Balance Error:')) {
                            showAlert(res.data);
                            return;
                        }
                        if (res.data === "PROCESSING") {
                            showAlert("Обрабатывается завершение другого события, нужно подождать");
                            return;
                        }

                        if (res.data === "OK") {
                            setModal(null)
                            showAlert(
                                "Событие в процессе завершения, скоро будут разосланы сообщения и произведены выплаты"
                            );
                        }
                    });
            }
        };
        window.Telegram.WebApp.onEvent("popupClosed", sendFinishTrigger);

        return () => window.Telegram.WebApp.offEvent("popupClosed", sendFinishTrigger);
    }, []);

    return (
        <motion.div
            initial={{ bottom: -20, opacity: 0 }}
            animate={{ bottom: 0, opacity: 1 }}
            exit={{ bottom: -20, opacity: 0 }}
            className={styles.modal}
        >
            <div className={styles.header}>
                <Link to={`/event/${event.id}`}>
                    <h1 className={styles.modaltitle}>{event.title}</h1>
                </Link>
            </div>

            <div className={styles.modalcontent}>
                <p className={styles.sectiontitle}>Суммарный пул:</p>
                <p className={styles.sectionvalue}>
                    <span>{fromNano(event.collectedAmount || 0)} TON </span>({startTotal} команда ММейкеров)
                </p>
                <p className={styles.sectiontitle}>Команда ММейкеров</p>
                <div className={styles.sides}>
                    <div className={styles.sideBlock}>
                        <p className={styles.sideValue}>{startv1} TON</p>
                        {event.startV1 && <p className={styles.coeff}>x{(startTotal / startv1).toFixed(2)}</p>}
                    </div>
                    <div className={styles.sideBlock}>
                        <p className={styles.sideValue}>{startv2} TON</p>
                        {event.startV2 && <p className={styles.coeff}>x{(startTotal / startv2).toFixed(2)}</p>}
                    </div>
                </div>

                <p className={styles.sectiontitle}>Рыночные транзакции</p>
                <div className={styles.sides}>
                    <div className={styles.sideBlock}>
                        <p className={styles.sideValue}>{realv1} TON</p>
                        <p className={styles.coeff}>x{(realTotal / realv1).toFixed(2) || 0}</p>
                    </div>
                    <div className={styles.sideBlock}>
                        <p className={styles.sideValue}>{realv2} TON</p>
                        <p className={styles.coeff}>x{(realTotal / realv2).toFixed(2) || 0}</p>
                    </div>
                </div>

                {event.finishData ? (
                    <div className={styles.finish}>
                        <p className={styles.finishText}>
                            Завершено: <span>{formatDate(event.finishData.date)}</span>
                        </p>
                        <p className={styles.finishText}>
                            Победитель: <span>{event.finishData.winner}</span>
                        </p>
                        <p className={styles.finishText}>
                            Всего к выплате: <span>{fromNano(event.finishData.totalAmountToSend)}</span>
                        </p>
                        <p className={styles.finishText}>
                            Чистая прибыль: <span>{fromNano(event.finishData.serviceFeeAmount)}</span>
                        </p>
                        <p className={styles.finishText}>
                            Владельцу NFT: <span>{fromNano(event.finishData.nftOwnerAmount)}</span>
                        </p>
                        <p className={styles.finishText}>
                            Комиссия первого владельца: <span>{fromNano(event.finishData.firstOwnerFeeAmount)}</span>
                        </p>
                    </div>
                ) : (
                    <>
                        <p className={styles.sectiontitle}>На данный момент</p>
                        <div className={styles.sides}>
                            <div className={styles.sideBlock}>
                                <p className={styles.sideValue}>{current1} TON</p>
                                {<p className={styles.coeff}>x{(currentTotal / current1).toFixed(2)}</p>}
                            </div>
                            <div className={styles.sideBlock}>
                                <p className={styles.sideValue}>{current2} TON</p>

                                {<p className={styles.coeff}>x{(currentTotal / current2).toFixed(2)}</p>}
                            </div>
                        </div>
                        <p className={styles.sectiontitle}>Залить на:</p>
                        <div className={styles.sides}>
                            <input type="number" value={i1} onChange={handleChangeV1} />
                            <input type="number" value={i2} onChange={handleChangeV2} />
                        </div>
                        <button className={styles.addFakePullButton} onClick={handleUpdateStartValue}>
                            Добавить
                        </button>
                        <button
                            className={styles.addFakePullButton}
                            onClick={handleChangeStatus}
                            style={{ backgroundColor: "#86881d" }}
                        >
                            {event.status === "hidden" ? "Опубликовать голосование" : "Скрыть голосование"}
                        </button>

                        {event.status !== "finished" && (
                            <button className={styles.finishEventButton} onClick={handleFinish}>
                                Завершить и выплатить
                            </button>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}

function Event({
    event,
    setToModal,
}: {
    event: IEvent;
    setToModal: React.Dispatch<React.SetStateAction<IEvent | null>>;
}) {
    return (
        <div className={styles.event} onClick={() => setToModal(event)}>
            {event.status === "active" && <p className={styles.statusActive}>{event.status}</p>}
            {event.status === "finished" && <p className={styles.statusFinished}>{event.status}</p>}
            {event.status === "over" && <p className={styles.statusOver}>{event.status}</p>}
            {event.status === "hidden" && <p className={styles.statusHidden}>{event.status}</p>}
            <div className={styles.ts}>
                <div className={styles.ls}>
                    <div className={styles.imgBlock}>
                        <img src={event.image} alt="" />
                    </div>

                    <div>
                        <p className={styles.eName}>{event.title}</p>
                        <p className={styles.date}>
                            Дата создания: <span>{formatDate(event.created_at)}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatDate(date: string | Date): string {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Месяцы в JavaScript начинаются с 0
    const year = d.getFullYear();

    return `${day}.${month}.${year}`;
}
