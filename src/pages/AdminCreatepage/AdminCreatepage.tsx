import React, { useEffect, useState } from "react";
import styles from "./AdminCreatepage.module.scss";
import { useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api";
import { Address, toNano } from "@ton/ton";
import { AnimatePresence } from "motion/react";
import useBackButton from "../../hooks/useBackButton";

const AdminCreatepage: React.FC = () => {
	useBackButton();
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.status !== null && user.status !== 0) {
            navigate("/");
            return;
        }
    }, [user]);

    const [title, setTitle] = useState<string>("");
    const [shortDescription, setShortDescription] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [creator, setCreator] = useState<string>("");
    const [expDateTimestamp, setExpDateTimestamp] = useState<string>("");
    const [collectedV1, setCollectedV1] = useState<string>("");
    const [collectedV2, setCollectedV2] = useState<string>("");
    const [result, setResult] = useState<"v1" | "v2">("v1");
    const [nftIndex, setNftIndex] = useState<string>("");
    const [status, setStatus] = useState<"active" | "hided">("active");

    const handleCreate = () => {
        const showAlert = (text: string) => {
            window.Telegram.WebApp.showAlert(text);
        };

        if (!image.startsWith("https://")) {
            showAlert("Ссылка должна быть публично доступна и начинаться с https://");
            return;
        }

        if (isNaN(new Date(Date.now() + 1000 * 60 * Number(expDateTimestamp) * 60).getTime())) {
            showAlert("Неверный формат даты завершения. Введи просто кол-во часов например: 1");
            return;
        }

        if (!nftIndex || Number(nftIndex) > 116 || Number(nftIndex) < 1) {
            showAlert("Некорректный NFT Creator. Необходимо ввести index от 1 до 116.");
            return;
        }

        try {
            Address.parse(creator);
        } catch {
            showAlert("Некорректный адрес creator");
            return;
        }

        authApi
            .post("/createEventAdmin", {
                title,
                shortDescription,
                description,
                image,
                creator,
                expDateTimestamp: new Date(Date.now() + 1000 * 60 * Number(expDateTimestamp) * 60).getTime(),
                collectedV1: toNano(collectedV1).toString(),
                collectedV2: toNano(collectedV2).toString(),
                result,
                status,
                nftIndex: Number(nftIndex),
            })
            .then((res) => {
                if (res.data === "OK") {
                    console.log("asdfa");
                    setTitle("");
                    setShortDescription("");
                    setDescription("");
                    setImage("");
                    setCreator("");
                    setExpDateTimestamp("");
                    setCollectedV1("");
                    setCollectedV2("");
                    setNftIndex("");

                    window.scrollTo(0, 0);
                    showAlert(`Голосование успешно создано!`);
                }
            })
            .catch((er) => {
                showAlert(er.response.data);
            });
    };

    return (
        <div className={styles.wrapper}>
            <h1 className="pagetitle">Создать голосование</h1>
            <Input
                value={title}
                title={"Название"}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"Название"}
                text={"Название голосования, не слишком длинное"}
            />
            <Input
                value={shortDescription}
                title={"Краткое описание"}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder={"Краткое описание"}
                text={"Краткое описание, начало описания будет видно на главной странице"}
            />
            <Input
                value={description}
                title={"Полное описание"}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Описание"}
                text={"Более подробное описание, будет видно при разворачивании на странице голосования"}
            />
            <Input
                value={image}
                title={"Ссылка на изображение"}
                onChange={(e) => setImage(e.target.value)}
                placeholder={"https://..."}
                text={"Ссылка на изображение. Должна быть общедоступная. Для проверки можно открыть в браузере"}
            />
            <Input
                value={creator}
                title={"Адрес создателя"}
                onChange={(e) => setCreator(e.target.value)}
                placeholder={"UQ..."}
                text={"Адрес создателя голосования. При рассчете на этот адрес придет выплата!"}
            />

            <Input
                value={nftIndex}
                title={"Номер NFT Creator"}
                onChange={(e) => setNftIndex(e.target.value)}
                placeholder={"12"}
                text={"1-100 обычные, 101-109 = 0.1 - 0.9, 110-116 римские по возрастанию"}
            />
            <Input
                value={expDateTimestamp}
                title={"Время до завершения (часов)"}
                onChange={(e) => setExpDateTimestamp(e.target.value)}
                placeholder={"6"}
                text={
                    "Количество часов, через которое голосование пропадет из выдачи. Ввести просто число, например 2 или 1.5"
                }
            />
            <Input
                value={collectedV1}
                title={'Собрано за "Да"'}
                onChange={(e) => setCollectedV1(e.target.value)}
                placeholder={"0"}
                text={""}
            />
            <Input
                value={collectedV2}
                title={'Собрано за "Нет"'}
                onChange={(e) => setCollectedV2(e.target.value)}
                placeholder={"0"}
                text={""}
            />

            <div className={styles.picker}>
                <button
                    onClick={() => setResult("v1")}
                    className={result === "v1" ? styles.pickedBtn : styles.pickBtn}
                    style={{ backgroundColor: "var(--color-vote-green)" }}
                >
                    Выше
                </button>
                <button
                    onClick={() => setResult("v2")}
                    className={result === "v2" ? styles.pickedBtn : styles.pickBtn}
                    style={{ backgroundColor: "var(--color-vote-red)" }}
                >
                    Ниже
                </button>
            </div>

            <div className={styles.showNow}>
                <p>Опубликовать сразу:</p>
                <AnimatePresence>
                    <div
                        onClick={() => {
                            if (status === "active") {
                                setStatus("hided");
                                return;
                            }

                            setStatus("active");
                        }}
                        className={status === "active" ? styles.toggleActive : styles.toggler}
                    >
                        <div className={styles.toggleBall}></div>
                    </div>
                </AnimatePresence>
            </div>

            <button className={styles.send} onClick={handleCreate}>
                Создать
            </button>
        </div>
    );
};

export default AdminCreatepage;

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
