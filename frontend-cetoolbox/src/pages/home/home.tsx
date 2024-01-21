import React from 'react';
//import { useNavigate } from 'react-router-dom';

import './home.css';
import { homeEvent, homeFavorite, note } from '../../components/types';
import { DragAndDrop, button } from '../../components/components';
import { requester } from '../../components/requester';

function Home() {
    //let navigate = useNavigate();
    const [notes, setNotes] = React.useState<note[]>([
        {
            _id: "0",
            title: "Test1",
            content: "Test avec plein de mots pour voir si ca marche bien et que ca ne depasse pas",
            tags: [],
            sharedWith: [],
            color: "9dfbe1",
        },
        {
            _id: "1",
            title: "Test2",
            content: "Test",
            tags: [],
            sharedWith: [],
            color: "fff555"
        },
        {
            _id: "2",
            title: "Test3",
            content: "Test avec plein de mots pour voir si ca marche bien et que ca ne depasse pas",
            tags: [],
            sharedWith: [],
            color: "c79dfb",
        },
        {
            _id: "3",
            title: "Test4",
            content: "Test avec plein de mots pour voir si ca marche bien et que ca ne depasse pas",
            tags: [],
            sharedWith: [],
            color: "fb9dca",
        },
        {
            _id: "4",
            title: "Test5",
            content: "Test avec plein de mots pour voir si ca marche bien et que ca ne depasse pas",
            tags: [],
            sharedWith: [],
            color: "fbab9d",
        },
    ]);
    const [events, setEvents] = React.useState<homeEvent[]>([]);
    const [favorites, setFavorites] = React.useState<homeFavorite[]>([]);

    //React.useEffect(() => {
    //    fetch('http://localhost:8000/api/notes')
    //        .then(res => res.json())
    //        .then(data => setNotes(data))
    //        .catch(err => console.log(err));
    //    fetch('http://localhost:8000/api/events')
    //        .then(res => res.json())
    //        .then(data => setEvents(data))
    //        .catch(err => console.log(err));
    //
    //    fetch('http://localhost:8000/api/favorites')
    //        .then(res => res.json())
    //        .then(data => setFavorites(data))
    //        .catch(err => console.log(err));
    //}, []);

    function notesToHTML(): JSX.Element {
        return <div id="note-content">
            {button({ text: "Ajouter une note", onClick: () => { } })}
            {button({ text: "Sauvegarder l'ordre des notes", onClick: () => { saveNotesOrder() } })}
            <DragAndDrop list={notes} setList={setNotes} id='notes' areaClassName='notes' content={notes.map((note, index) => <div
                className="note"
                style={{ backgroundColor: ("#" + note.color) }}
                key={index}
                id={"note-" + index}
                draggable
                onDragStart={() => { document.getElementById("note-" + index)?.classList.add("dragging") }}
                onDragEnd={() => { document.getElementById("note-" + index)?.classList.remove("dragging") }}
            >
                <input name={"note-title-" + index} className="note-title input-transparent" value={note.title} onChange={(e) => setNotes(notes.map((n, i) => { if (i === index) { n.title = e.target.value }; return n }))} />
                <textarea name={"note-content-" + index} className="note-content input-transparent input-textarea" value={note.content} onChange={(e) => setNotes(notes.map((n, i) => { if (i === index) { n.content = e.target.value }; return n }))} />
                <div>
                    {button({ text: "Modifier", onClick: () => { saveNote() } })}
                    <input name={"note-color-" + index} className='color-picker' type="color" value={"#" + note.color} onChange={(e) => setNotes(notes.map((n, i) => { if (i === index) { n.color = e.target.value.substring(1) }; return n }))} />
                </div>
            </div>)} />
        </div>
    }

    function eventsToHTML(): JSX.Element {
        return <div id="events">
            {events.map((event, index) => <div className="event" key={index}>{event.title}</div>)}
        </div>
    }

    function favoritesToHTML(): JSX.Element {
        return <div id="favorites">
            {favorites.map((favorite, index) => <a className="favorite" key={index} href={favorite.url}>{favorite.title}</a>)}
        </div>
    }

    function saveNote() {
        requester("POST", "notes", { notes: notes });
    }

    function saveNotesOrder() {
        const ddList = document.getElementById("ddlistnotes");
        let elements = ddList?.querySelectorAll(".ddeltnotes");
        if (elements === null || elements === undefined) { return; }
        let tempNotes = [...notes];

        for (let i = 0; i < notes.length; i++) {
            tempNotes[i] = notes[parseInt(elements[i].id.split("-")[1])];
            console.log(parseInt(elements[i].id.split("-")[1]));
            console.log(elements[i]);
        }

        setNotes(tempNotes);
        requester("POST", "notes", { notes: tempNotes });
        window.location.reload();
    }

    return <div id="home" className='page'>
        <h1 id="home-title">Accueil de la CE ToolBox</h1>

        <div id='home-content'>
            <div id="notes-area">
                <h2>Notes</h2>
                {notesToHTML()}
            </div>
            <div id='home-content-right'>
                <div>
                    <h2>Évènements de la semaine</h2>
                    {eventsToHTML()}
                </div>
                <div>
                    <h2>Favoris</h2>
                    {favoritesToHTML()}
                </div>
            </div>
        </div>
    </div>
}

export default Home