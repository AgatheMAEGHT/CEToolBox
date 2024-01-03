import { useNavigate } from 'react-router-dom';
import './recipes.css';

function RecipesList() {
    let navigate = useNavigate();

    return <div id="recipes" className='page'>
        <h2>Recettes de la CE Toolbox</h2>
        <button onClick={() => navigate("/recipes/ingredients")}>Ingrédients</button>
        <button onClick={() => navigate("/recipes/ingredients")}>Recettes</button>
        <button onClick={() => navigate("/recipes/ingredients")}>Fromages</button>
    </div>
}

export default RecipesList;