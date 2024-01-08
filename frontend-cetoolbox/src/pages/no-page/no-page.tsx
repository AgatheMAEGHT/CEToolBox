import { useNavigate } from 'react-router-dom';
import './no-page.css';
import { button } from '../../components/components';

function NoPage() {
    let navigate = useNavigate();

    return <div id="no-page" className='page'>
        <p><b>Cette page n'existe pas</b></p>
        {button({ text: "Revenir à l'accueil", onClick: () => navigate("/") })}
    </div>
}

export default NoPage;