import { createSlice } from "@reduxjs/toolkit";
import { IDemoVote, IEvent } from "../../types/types";

export interface IAppSlice {
    keyboard: boolean;
    vote: {
        title: string;
        amount: string;
    };
    events: IEvent[];
}

const initialState: IAppSlice = {
    keyboard: false,
    vote: {
        title: "",
        amount: "",
    },
    events: [],
};

const AppSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setMyDemoVote: (state, { payload }) => {
            const { eventId, myDemoVote } = payload;

            state.events = state.events.map((event) => {
                if (event.id === eventId) {
                    return {
                        ...event,
                        myDemoVote: myDemoVote,
                    };
                }
                return event;
            });
        },
        setEvents: (state, { payload }) => {
            let events = payload.events;

            // Обработка лайков
            if (payload.likes && payload.likes.length > 0) {
                const likedEventIds = payload.likes.map((a: { eventId: string }) => a.eventId);
                events = events.map((event: IEvent) => ({
                    ...event,
                    isLiked: likedEventIds.includes(event.id),
                }));
            }

            // Обработка демо-голосов
            if (payload.demoVotes && payload.demoVotes.length > 0) {
                // Создаем мапу для быстрого поиска голосов по eventId
                const demoVotesMap = payload.demoVotes.reduce((map: Record<string, string>, vote: IDemoVote) => {
                    map[vote.eventId] = vote.voteType;
                    return map;
                }, {});

                console.log(demoVotesMap)

                events = events.map((event: IEvent) => ({
                    ...event,
                    myDemoVote: demoVotesMap[event.id] || null,
                }));
            }

            state.events = events;
        },
        setVote: (state, { payload }) => {
            state.vote.title = payload.title;
        },
        openKeyboard: (state) => {
            state.keyboard = true;
        },
        closeKeyboard: (state) => {
            state.keyboard = false;
        },
        setAmount: (state, { payload }) => {
            if (payload === "del") {
                state.vote.amount = state.vote.amount.slice(0, -1);
                return;
            }

            if (payload === "c") {
                state.vote.amount = "";
                return;
            }
            state.vote.amount = state.vote.amount + payload;
        },
    },
});

export const { setMyDemoVote, setEvents, setVote, openKeyboard, closeKeyboard, setAmount } = AppSlice.actions;

export default AppSlice.reducer;
