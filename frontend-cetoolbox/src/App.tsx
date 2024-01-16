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
import RecipesDetail from './pages/recipes/recipes/recipes-detail/recipes-detail';
import RecipesEdit from './pages/recipes/recipes/recipes-edit/recipes-edit';
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
                        <Route path="food" element={<RecipesHome />} />
                        <Route path="food/ingredients" element={<Ingredients />} />
                        <Route path="food/ingredients/:itemName" element={<IngredientsDetail />} />
                        <Route path="food/recipes" element={<RecipesList />} />
                        <Route path="food/recipes/:itemName" element={<RecipesDetail />} />
                        <Route path="food/recipes/edit/:itemName" element={<RecipesEdit />} />
                        <Route path="food/cheeses" element={<Cheeses />} />
                    </>}

                    <Route path='/' element={<Login />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
