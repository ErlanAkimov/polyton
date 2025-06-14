import React from "react";
import styles from "./Keyboard.module.scss";
import { AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { closeKeyboard } from "../../store/slices/AppSlice";
import { motion } from "motion/react";

const Keyboard: React.FC = () => {
    const keyboard = useAppSelector((state) => state.app.keyboard);
    const vote = useAppSelector((state) => state.app.vote);
    const dispatch = useAppDispatch();

    const hadnleCloseKeyboard = () => {
        dispatch(closeKeyboard());
    };

    return (
        <div className={styles.wrapper} style={{ pointerEvents: keyboard ? "initial" : "none" }}>
            <AnimatePresence>
                {keyboard && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "none" }}
                            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                            exit={{ opacity: 0, backdropFilter: "none" }}
                            onClick={hadnleCloseKeyboard}
                            className={styles.overlay}
                        />
                        <motion.div
                            initial={{ top: 30, opacity: 0, rotate: 0 }}
                            animate={{ top: 0, opacity: 1, rotate: 0 }}
                            exit={{ top: -30, opacity: 0, rotate: 6 }}
                            className={styles.modal}
                        >
                            <h2 className={styles.title}>{vote.title}</h2>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Keyboard;
