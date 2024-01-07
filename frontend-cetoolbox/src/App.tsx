import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/header/header';
import NoPage from './pages/no-page/no-page';
import Home from './pages/home/home';
import Page from './pages/docs/page';
import Lists from './pages/lists/lists';
import RecipesHome from './pages/recipes/recipes';
import Ingredients from './pages/recipes/ingredients/ingredients';
import IngredientsDetail from './pages/recipes/ingredients/ingredients-detail/ingredients-detail';
import RecipesList from './pages/recipes/recipes/recipes';
import Cheeses from './pages/recipes/cheeses/cheeses';
import Login from './pages/login/login';

import './App.css';
import './components/style.css';
import './components/blocks/blocks.css';

function App() {
    let logged: string | null = localStorage.getItem("logged");

    return (
        <div id="App">
            <BrowserRouter>
                {logged !== null && <Header />}
                <Routes>
                    {logged !== null && <>
                        <Route path='/' element={<Home />} />
                        <Route path="docs" element={<Page />} />
                        <Route path="lists" element={<Lists />} />
                        <Route path="recipes" element={<RecipesHome />} />
                        <Route path="recipes/ingredients" element={<Ingredients />} />
                        <Route path="recipes/ingredients/:itemName" element={<IngredientsDetail />} />
                        <Route path="recipes/list" element={<RecipesList />} />
                        <Route path="recipes/cheeses" element={<Cheeses />} />
                    </>}

                    <Route path='/' element={<Login />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
