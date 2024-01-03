import { useNavigate } from 'react-router-dom';
import './cheeses.css';

function Cheeses() {
    let navigate = useNavigate();

    return <div id="recipes" className='page'>
        <h2>Recettes de la CE Toolbox</h2>
        <button onClick={() => navigate("/recipes/ingredients")}>Ingrédients</button>
        <button onClick={() => navigate("/recipes/ingredients")}>Recettes</button>
        <button onClick={() => navigate("/recipes/ingredients")}>Fromages</button>
    </div>
}

export default Cheeses;