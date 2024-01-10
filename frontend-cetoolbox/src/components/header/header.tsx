import React from 'react';

import { useNavigate } from 'react-router-dom';

import './header.css';

function Header() {
    let navigate = useNavigate();

    return <div id="header">
        <a className='header-button' href='/' onClick={() => navigate("/")}>Accueil</a>
        <a className='header-button' href='/calendar'>Calendrier</a>
        <a className='header-button' href='/docs'>Documents</a>
        <a className='header-button' href='/notes'>Notes</a>
        <div className='header-button header-dropdown'>
            <a className='header-button' href='/food'>Recettes</a>
            <div className="header-dropdown-list">
                <a className='header-dropdown-button' href='/food/ingredients' >Ingrédients</a>
                <a className='header-dropdown-button' href='/food/list' >Recettes</a>
                <a className='header-dropdown-button' href='/food/cheeses' >Fromages</a>
            </div >
        </div >
        <div className='header-button header-dropdown'>
            <a className='header-button' href='/lists'>Listes</a>
            <div className="header-dropdown-list">
                <a className='header-dropdown-button' href='/food/ingredients'>Courses</a>
                <a className='header-dropdown-button' href='/food/list'>Noël</a>
            </div >
        </div >
        <a className='header-button' href='/profile'>Profil</a>
    </div >
}

export default Header;