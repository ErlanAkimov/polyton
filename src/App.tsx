import React from "react";
import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage/Homepage";

import useUserAuth from "./hooks/useUserAuth";

import useWallet from "./hooks/useWallet";
import Header from "./components/Header/Header";
import Keyboard from "./components/Keyboard/Keyboard";
import Eventpage from "./pages/Eventpage/Eventpage";
import Adminpage from "./pages/Adminpage/Adminpage";
import Pendingpage from "./pages/Pendingpage/Pendingpage";
import Anketapage from "./pages/Anketapage/Anketapage";

const App: React.FC = () => {
    useUserAuth();
    useWallet();

    return (
        <div>
            <Header />
            <Keyboard />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/event/:eventId" element={<Eventpage />} />
                <Route path="/admin-panel" element={<Adminpage />} />
                <Route path="/pending" element={<Pendingpage />} />
                <Route path="/anketa" element={<Anketapage />} />
            </Routes>
        </div>
    );
};

export default App;
