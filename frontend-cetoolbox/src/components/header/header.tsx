import React from 'react';

import { useNavigate } from 'react-router-dom';

import './header.css';

function Header() {
    let navigate = useNavigate();

    return <div id="header">
        <a className='header-button' href='/' onClick={() => navigate("/")}>Accueil</a>
        <a className='header-button' href='/calendar'>Calendrier</a>
        <a className='header-button' href='/docs'>Documents</a>
        <div className='header-button header-dropdown'>
            <a className='header-button' href='/food'>Manger</a>
            <div className="header-dropdown-list">
                <a className='header-dropdown-button' href='/food/what-do-we-eat'>Que faire a manger ?</a>
                <a className='header-dropdown-button' href='/food/recipes'>Recettes</a>
                <a className='header-dropdown-button' href='/food/ingredients'>Ingrédients</a>
                <a className='header-dropdown-button' href='/food/cheeses'>Fromages</a>
            </div>
        </div>
        <div className='header-button header-dropdown'>
            <a className='header-button' href='/lists'>Listes</a>
            <div className="header-dropdown-list">
                <a className='header-dropdown-button' href='/lists/cart'>Courses</a>
                <a className='header-dropdown-button' href='/lists/stock'>Stock</a>
                <a className='header-dropdown-button' href='/lists/christmas'>Noël</a>
            </div >
        </div >
        <a className='header-button' href='/profile'>Profil</a>
    </div >
}

export default Header;