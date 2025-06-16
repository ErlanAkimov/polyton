import React, { useEffect, useMemo, useState } from "react";
import styles from "./Homepage.module.scss";
import SectionTabs from "./SectionTabs";
import EventCard from "./EventCard";
import { api } from "../../api";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setEvents } from "../../store/slices/AppSlice";
import CreateEvent from "./CreateEvent";

const emptyArray = ["", "", ""];

const Homepage: React.FC = () => {
    const events = useAppSelector((state) => state.app.events);
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState<string>("token");
    const [isLoading, setIsLoading] = useState(!events.length);

    useEffect(() => {
        if (events.length <= 1) {
            setIsLoading(true);
            api.get(`/getEvents?userId=${window.Telegram.WebApp.initDataUnsafe.user.id}`)
                .then((res) => {
                    dispatch(setEvents(res.data));
                })
                .finally(() => setIsLoading(false));
        }
    }, [dispatch, events.length]);

    const filteredEvents = useMemo(() => {
        return events.filter((a) => a.category.includes(tab));
    }, [events, tab]);

    const handlePickTab = (s: string) => {
        setTab(s);
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.marketTitle}>Market</h1>

            <SectionTabs tab={tab} onPickTab={handlePickTab} />

            {tab !== "event" && (
                <div className={styles.list}>
                    {isLoading || !events.length
                        ? emptyArray.map((_, i) => <div key={i} className={styles.eventskeleton}></div>)
                        : filteredEvents.map((a) => <EventCard key={`${a.id}-${tab}`} event={a} />)}
                </div>
            )}

            {tab === "event" && <CreateEvent />}
        </div>
    );
};

export default Homepage;
