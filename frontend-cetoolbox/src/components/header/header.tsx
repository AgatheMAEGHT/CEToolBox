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
        <div className='header-button header-dropdown'>
            <p className='header-button' onClick={() => navigate("/recipes")}>Recettes</p>
            <div className="header-dropdown-list">
                <p className='header-dropdown-button' onClick={() => navigate("/recipes/ingredients")}>Ingrédients</p>
                <p className='header-dropdown-button' onClick={() => navigate("/recipes/list")}>Recettes</p>
                <p className='header-dropdown-button' onClick={() => navigate("/recipes/cheeses")}>Fromages</p>
            </div>
        </div>
        <div className='header-button header-dropdown'>
            <p className='header-button' onClick={() => navigate("/lists")}>Listes</p>
            <div className="header-dropdown-list">
                <p className='header-dropdown-button' onClick={() => navigate("/recipes/ingredients")}>Courses</p>
                <p className='header-dropdown-button' onClick={() => navigate("/recipes/list")}>Noël</p>
            </div>
        </div>
        <p className='header-button' onClick={() => navigate("/profile")}>Profil</p>
    </div>
}

export default Header;