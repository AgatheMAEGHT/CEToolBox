import { useNavigate } from 'react-router-dom';
import './recipes.css';

function RecipesHome() {
    let navigate = useNavigate();

    return <div id="recipes" className='page'>
        <h2>Recettes de la CE Toolbox</h2>
        <button className='recipes-button' onClick={() => navigate("/recipes/ingredients")}><div className='recipes-button-content'>Ingrédients</div></button>
        <button className='recipes-button' onClick={() => navigate("/recipes/list")}><div className='recipes-button-content'>Recettes</div></button>
        <button className='recipes-button' onClick={() => navigate("/recipes/cheeses")}><div className='recipes-button-content'>Fromages</div></button>
    </div>
}

export default RecipesHome;