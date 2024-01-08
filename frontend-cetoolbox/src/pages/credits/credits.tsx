import { useNavigate } from 'react-router-dom';

import './credits.css';

function Credits() {
    let navigate = useNavigate();

    return <div id="credits" className='page'>
        <h1>Crédits</h1>
        <p>Certaines icônes utilisées dans cette application proviennent de <a href="https://www.flaticon.com/">Flaticon</a>.</p>
        <a href="https://www.flaticon.com/fr/icones-gratuites/fouet" title="fouet icônes">Fouet icônes créées par Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/fr/icones-gratuites/four" title="four icônes">Four icônes créées par Good Ware - Flaticon</a>
    </div>
}

export default Credits;