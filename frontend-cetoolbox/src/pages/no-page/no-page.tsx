import { useNavigate } from 'react-router-dom';
import './no-page.css';

function NoPage() {
    let navigate = useNavigate();

    return <div id="no-page" className='page'>
        <p>Cette page n'existe pas</p>
        <button onClick={() => navigate("/")}>Revenir à l'accueil</button>
    </div>
}

export default NoPage;