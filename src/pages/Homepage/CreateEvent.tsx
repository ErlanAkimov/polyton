import React, { useEffect, useState } from "react";
import styles from "./CreateEvent.module.scss";
import { authApi } from "../../api";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/ton";
import { nftAddresses, nftList } from "../../store/creatorNftList";
import axios from "axios";
import { ICreatorNft } from "../../types/types";
const colors = ["#B1B1B1", "#F09967", "#A52A2A"];

const CreateEvent: React.FC = () => {
    const [token, setToken] = useState<string>("");
    const [mcap, setMcap] = useState<string>("");
    const [expDate, setExpDate] = useState<string>("");
    const [liquidity, setLiquidity] = useState<string>("");
    const [result, setResult] = useState<string>("v1");
    const [_, setShortDescription] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();

    const handleSend = () => {
        if (!wallet) {
            tc.openModal();
            return;
        }

        if (!matchedNfts || matchedNfts.length <= 0) {
            window.Telegram.WebApp.showPopup({
                title: "Отсутствует NFT",
                message: "Нельзя создавать события с кошелька, на котором нет Polyton CREATORS NFT.",
                buttons: [{ text: "Ок", type: "ok" }],
            });
            return;
        }

        if (Number(liquidity) < 10) {
            window.Telegram.WebApp.showAlert("Ликвидность не может быть ниже 10 TON");
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
                description,
                creatorNft: matchedNfts.find((a) => a.index === creatorNft),
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
            })
            .catch((err) => {
                console.log(err)
            })
    };

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

    const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleChangeShortDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShortDescription(e.target.value);
        handleChangeShortDescription
    };

    const [nftLoading, setNftLoading] = useState<boolean>(false);
    const [matchedNfts, setMatchedNfts] = useState<ICreatorNft[] | null>(null);
    const [creatorNft, setCreatorNft] = useState<number>(matchedNfts ? matchedNfts[0]?.index : 0);

    useEffect(() => {
        async function fetchMyNfts() {
            if (!wallet || nftLoading) return;
            setNftLoading(true);
            const local = JSON.parse(localStorage.getItem("my-creator-nfts") || JSON.stringify({ time: false }));

            if (local.time && local.time > Date.now() - 60 * 1000) {
                console.log("Cached nft matchList, could update after:", local.time + 60 * 1000 - Date.now(), "ms");
                setMatchedNfts(local.nftList);
                return;
            }

            const { data } = await axios.get(
                `https://toncenter.com/api/v3/nft/items?owner_address=${wallet.account.address}&limit=200&offset=0`
            );

            const matchList = data?.nft_items
                ?.map((a: any) => {
                    if (!nftAddresses.includes(a.address)) return;

                    return nftList.find((n) => n.address === a.address);
                })
                .filter((a: ICreatorNft | undefined) => a);

            setMatchedNfts(matchList);

            localStorage.setItem("my-creator-nfts", JSON.stringify({ nftList: matchList, time: Date.now() }));
            setNftLoading(false);
        }

        fetchMyNfts();
    }, []);

    useEffect(() => {
        if (!matchedNfts || !matchedNfts.length) return;

        setCreatorNft(matchedNfts[0].index);
    }, [matchedNfts]);

    return (
        <div className={styles.wrapper}>
            {matchedNfts && matchedNfts.length > 0 && (
                <div className={styles.nftWrapper}>
                    <div className={styles.nfts}>
                        {matchedNfts.map((nft, i) => {
                            return (
                                <div
                                    key={i}
                                    onClick={() => setCreatorNft(nft.index)}
                                    className={styles.nftItem}
                                    style={{
                                        opacity: creatorNft === nft.index ? 1 : 0.3,
                                        backgroundColor: colors[nft.collection],
                                    }}
                                >
                                    {isNaN(Number(nft.symbol)) ? nft.symbol : `(${nft.symbol})`}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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

            {/* <Input
                value={shortDescription}
                onChange={handleChangeShortDescription}
                title="Краткое описание"
                placeholder="Краткое описание"
                text="Опишите голосование в паре предложений"
            /> */}

            <Input
                value={description}
                onChange={handleChangeDescription}
                title="Подробное описание (необязательно)"
                placeholder="Описание голосования"
                text="Опишите дополнительные детали голосования в паре предложений. Можете указать ссылки или что-то еще"
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
