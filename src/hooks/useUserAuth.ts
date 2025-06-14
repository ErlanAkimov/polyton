import { useEffect } from "react";
import { authApi } from "../api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { setUser } from "../store/slices/UserSlice";

export default function () {
    const params = new URLSearchParams(window.location.search);

    const param = params.get("tgWebAppStartParam")?.split("-");
    const navigate = useNavigate();

    const ref = Number(param?.filter((a) => a.startsWith("ref_"))[0].split("_")[1]) || null;

    const eventId = param?.filter((a) => a.startsWith("event"))[0].split("_")[1] || null;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (eventId) {
            navigate(`/event/${eventId}`);
        }
        authApi
            .post("/", { ref })
            .then((res) => {
                if (res.data.user.status === 2) {
                    navigate("/anketa");
                    return;
                }

                if (res.data.user.status === 3) {
                    navigate("/pending");
                    return;
                }

                dispatch(setUser(res.data.user));
            })
            .catch((err) => {
                if (err.response) {
                    const response = err.response.data;
                    if (response.reason === "ban") {
                        navigate("/ban");
                    }
                } else {
                    console.log(err);
                }
            });
    }, []);
}
