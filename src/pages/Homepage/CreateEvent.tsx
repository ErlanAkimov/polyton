import React, { useEffect, useState } from "react";
import styles from "./CreateEvent.module.scss";
import { authApi, toncenter } from "../../api";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/ton";

const CreateEvent: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [shortDescription, setShortDescription] = useState<string>("");

    const wallet = useTonWallet();
    const [tc] = useTonConnectUI();

	const checkNft = () => {
		toncenter.get(`/nft/items?owner_address=${wallet?.account.address}&limit=1000&offset=0`).then((a) => console.log(a.data.nft_items));
	}

    const handleSend = () => {
        if (!wallet) {
            tc.openModal();
            return;
        }

		checkNft();

        authApi.post("/createEvent", {
            title,
            shortDescription,
            description,
            creator: Address.parse(wallet.account.address).toString({ bounceable: false }),
        });
    };


    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleSetDescription = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
    const handleSetShortDescription = (e: React.ChangeEvent<HTMLInputElement>) => setShortDescription(e.target.value);

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Запустить голосование</div>
            <div className={styles.disclaimer}>
                Создатели получают 5% от суммарного профита Пула победителей в голосовании. Так что создавай и
                рекламируй события с умом.
            </div>

            <Input
                value={title}
                onChange={handleSetTitle}
                title="Название события"
                placeholder="Например: Floor Pepe"
                text="Введите название события, до 24 символов"
            />

            <Input
                value={shortDescription}
                onChange={handleSetShortDescription}
                title="Краткое описание"
                placeholder="Будет ли floor на PEPE ниже 20k$ через 3 дня"
                text="Краткое описание будет показываться на карточке события на главной странице"
            />

            <Input
                value={description}
                onChange={handleSetDescription}
                title="Полное описание"
                placeholder="Введите полное описание"
                text="Как можно подробнее опишите условия события. Вы также можете добавить сюда ваши ссылки, относящиеся к событию"
            />

            <button className={styles.send} onClick={handleSend}>
                Отправить
            </button>
        </div>
    );
};

export default CreateEvent;

function Input({
    value,
    title,
    placeholder,
    text,
    onChange,
}: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
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
