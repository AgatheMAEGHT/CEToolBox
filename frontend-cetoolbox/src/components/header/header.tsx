import React from 'react';

import { useNavigate } from 'react-router-dom';

import './header.css';

function Header() {
    let navigate = useNavigate();

    return <div id="header">
        <p className='header-button' onClick={() => navigate("/")}>Accueil</p>
        <p className='header-button' onClick={() => navigate("/calendar")}>Calendrier</p>
        <p className='header-button' onClick={() => navigate("/docs")}>Documents</p>
        <p className='header-button' onClick={() => navigate("/notes")}>Notes</p>
        <p className='header-button' onClick={() => navigate("/recipes")}>Recettes</p>
        <p className='header-button' onClick={() => navigate("/lists")}>Listes</p>
        <p className='header-button' onClick={() => navigate("/profile")}>Profil</p>
    </div>
}

export default Header;