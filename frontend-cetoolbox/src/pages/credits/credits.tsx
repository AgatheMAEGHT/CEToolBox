import { useNavigate } from 'react-router-dom';

import './credits.css';

function Credits() {
    let navigate = useNavigate();

    return <div id="credits" className='page'>
        <h1>Crédits</h1>
        <p>Certaines icônes utilisées dans cette application proviennent de <a href="https://www.flaticon.com/">Flaticon</a>.</p>
        <a href="https://www.flaticon.com/fr/icones-gratuites/fouet" title="fouet icônes">Fouet icônes créées par Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/fr/icones-gratuites/four" title="four icônes">Four icônes créées par Good Ware - Flaticon</a>+
        <a href="https://www.flaticon.com/fr/icones-gratuites/dechet" title="déchet icônes">Déchet icônes créées par Lalaka - Flaticon</a>
        <a href="https://www.flaticon.com/fr/icones-gratuites/corbeille" title="corbeille icônes">Corbeille icônes créées par lakonicon - Flaticon</a>
        <a href="https://www.flaticon.com/fr/icones-gratuites/partager" title="partager icônes">Partager icônes créées par Karacis - Flaticon</a>
        <a href="https://www.flaticon.com/fr/icones-gratuites/ne-plus-suivre" title="ne plus suivre icônes">Ne plus suivre icônes créées par riajulislam - Flaticon</a>

    </div>
}

export default Credits;