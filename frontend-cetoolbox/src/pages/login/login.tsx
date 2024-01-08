import React from 'react';
import { useNavigate } from 'react-router-dom';

import { requester } from '../../components/requester';
import { button } from '../../components/components';

import './login.css';

function Login() {
    let navigate = useNavigate();
    const [profile, setProfile] = React.useState<any>({
        pseudo: '',
        password: '',
    });

    function login() {
        if (profile.pseudo === '' || profile.password === '') {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        requester('/login', 'POST', profile).then((res: any) => {
            if (res.access_token) {
                let d = new Date().setSeconds(new Date().getSeconds() + parseInt(res.expires_in) ?? 0)
                localStorage.setItem('logged', "client");
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('expire_date', d.toString());
                localStorage.setItem('refresh_token', res.refresh_token);
                localStorage.setItem('pseudo', profile.pseudo);

                // Get user infos
                requester('/who-am-i', 'GET').then((res2: any) => {
                    console.log(res2.isAdmin);
                    if (res2.isAdmin !== undefined) {
                        localStorage.setItem('logged', res2.isAdmin ? "admin" : "client");
                        localStorage.setItem('pseudo', res2.name);
                    } else {
                        console.log(res2);
                        alert("Une erreur est survenue, merci de réessayer ultérieurement");
                    }
                });

                navigate('/');
                window.location.reload();

            } else {
                if (res.message === 'Wrong pseudo or password') {
                    alert('Identifiant ou mot de passe incorrect');
                    return;
                }
                else {
                    console.log(res);
                    alert("Une erreur est survenue, merci de réessayer ultérieurement");
                }
            }
        });
    }

    return (
        <div id="login" className='page'>
            <div className="login-container">
                <h1>Se connecter</h1>
                <div id="login-container-inputs">
                    <div className="login-container-input">
                        <label className='login-label'>Identifiant</label>
                        <input className='input login-input' value={profile.pseudo} onChange={e => setProfile({ ...profile, pseudo: e.target.value })} type="text" />
                    </div>
                    <div className="login-container-input">
                        <label className='login-label'>Mot de passe</label>
                        <input className='input login-input' value={profile.password} onChange={e => setProfile({ ...profile, password: e.target.value })} type="password" />
                    </div>
                </div>
                <div className='rotating'>
                    {button({ text: 'Se connecter', onClick: () => { login() } })}
                </div>
            </div>
        </div>
    );
}

export default Login;
