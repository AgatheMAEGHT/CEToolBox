import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {
    let navigate = useNavigate();

    return <div id="home" className='page'>
        <h1 id="home-title">Accueil de la CE ToolBox</h1>

        <div>
            <h2>To To List</h2>
            <h2>Évènements de la semaine</h2>
            <h2>Favoris</h2>
        </div>
    </div>
}

export default Home;