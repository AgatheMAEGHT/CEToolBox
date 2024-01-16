import { useNavigate } from 'react-router-dom';
import './recipes.css';

function RecipesHome() {
    let navigate = useNavigate();

    return <div id="food" className='page'>
        <h2>Recettes de la CE Toolbox</h2>
        <button className='food-button' onClick={() => navigate("/food/ingredients")}><div className='food-button-content'>Ingrédients</div></button>
        <button className='food-button' onClick={() => navigate("/food/recipes")}><div className='food-button-content'>Recettes</div></button>
        <button className='food-button' onClick={() => navigate("/food/cheeses")}><div className='food-button-content'>Fromages</div></button>
    </div>
}

export default RecipesHome;