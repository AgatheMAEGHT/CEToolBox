import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/header/header';
import NoPage from './pages/no-page/no-page';
import Home from './pages/home/home';
import Docs from './pages/docs/docs';

import './App.css';
import './components/style.css';
import './components/blocks/blocks.css';

function App() {
    return (
        <div id="App">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path="docs" element={<Docs />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;