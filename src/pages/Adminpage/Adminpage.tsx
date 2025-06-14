import React, { useEffect, useState } from "react";
import styles from "./Adminpage.module.scss";
import useBackButton from "../../hooks/useBackButton";
import { useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api";
import { IconCancel, IconDoubleCheck, IconTon } from "../../components/icons";
import { fromNano } from "@ton/ton";

interface IRequest {
    userId: number;
    username: string;
    createdAt: string;
    text: string;
    transactionLink: string;
    tonAmount: string;
}

const Adminpage: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    useBackButton();
    const [usersList, setUsersList] = useState<IRequest[] | null>(null);

    useEffect(() => {
        if (user.status !== null && user.status !== 0) {
            navigate("/");
            return;
        }

        authApi.get("/getPendingUsers").then((res) => {
            setUsersList(res.data.usersList);
        });
    }, [user]);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.pageTitle}>Список пользователей ожидающих одобрения</h1>
            <div className={styles.userList}>
                {usersList && usersList.length === 0 && (
                    <div className={styles.noUsers}>Нет пользователей ожидающих одобрения</div>
                )}

                {usersList &&
                    usersList.length > 0 &&
                    usersList.map((request, index) => <PendingUser request={request} key={index} />)}
            </div>
        </div>
    );
};

export default Adminpage;

function PendingUser({ request }: { request: IRequest }) {
    const [approveStatus, setApproveStatus] = useState<number | null>(null); // 1 - принят, 2 - отказано, null - необходимо принять решение
    const handleApproveUser = async (status: number) => {
        await authApi.get(`/approveUser?id=${request.userId}&status=${status}`).then((res) => {
            setApproveStatus(res.data.status);
        });
    };

    const handleOpenUserOnTelegram = () => {
        if (!request.username) {
            window.Telegram.WebApp.showPopup({
                title: "Ошибка",
                message: "Пользователь скрыл свой username, не получится открыть профиль",
            });
            return;
        }
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${request.username}`);
    };

    return (
        <div className={styles.requestWrapper}>
            <div className={styles.userItem}>
                <div className={styles.lside}>
                    <div>
                        <div className={styles.username} onClick={handleOpenUserOnTelegram}>
                            {request.username ? `@${request.username}` : "username скрыт"}
                        </div>
                        <p className={styles.userId}>ID: {request.userId}</p>
                    </div>
                    <div className={styles.date} dangerouslySetInnerHTML={{ __html: formatDate(request.createdAt) }} />
                </div>

                {approveStatus === null && (
                    <div className={styles.buttons}>
                        <button className={styles.btn} onClick={() => handleApproveUser(1)}>
                            <IconDoubleCheck className={`${styles.btnIcon} ${styles.okBtn}`} />
                        </button>
                        <button className={styles.btn} onClick={() => handleApproveUser(5)}>
                            <IconCancel className={`${styles.btnIcon} ${styles.neokBtn}`} />
                        </button>
                    </div>
                )}

                {approveStatus === 1 && <p className={styles.approved} style={{color: 'var(--color-vote-green)'}}>Принят</p>}
                {approveStatus === 5 && <p className={styles.approved} style={{color: 'var(--color-vote-red)'}}>Отказано</p>}
            </div>
            <div className={styles.bside}>
                <p className={styles.txLink}>
                    Транзакция:{" "}
                    <a target="_blank" href={request.transactionLink}>
                        <span>перейти по ссылке</span>
                    </a>
                </p>
                <div className={styles.ton}>
                    {Number(fromNano(request.tonAmount)).toFixed(2)} <IconTon size={13} />
                </div>
            </div>
            {request.text && <div className={styles.rText}>{request.text}</div>}
        </div>
    );
}

function formatDate(date: string | Date): string {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Месяцы в JavaScript начинаются с 0
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year}<br />${hours}:${minutes}`;
}

