import React from 'react';
//import { useNavigate } from 'react-router-dom';

import './home.css';
import { homeEvent, homeFavorite, note } from '../../components/types';
import { DragAndDrop, button } from '../../components/components';
import { requester } from '../../components/requester';

function Home() {
    //let navigate = useNavigate();
    const [notes, setNotes] = React.useState<note[]>([]);
    const [events, setEvents] = React.useState<homeEvent[]>([]);
    const [favorites, setFavorites] = React.useState<homeFavorite[]>([]);
    const [users, setUsers] = React.useState<any[]>([]);
    const [selectedNoteIndex, setSelectedNoteIndex] = React.useState<number>(-1);

    React.useEffect(() => {
        requester("/user-notes", "GET").then((res: any) => {
            setNotes(res ?? []);
        });
        requester("/user", "GET").then((res: any) => {
            setUsers(res ?? []);
        });
    }, []);

    /* =======*
     *  Notes *
     * =======*/
    function notesToHTML(): JSX.Element {
        return <div id="note-content">
            {button({ text: "Ajouter une note", onClick: () => { addNote() } })}
            <DragAndDrop list={notes} setList={saveNotesOrder} id='notes' areaClassName='notes' content={notes.map((note, index) =>
                <div
                    className="note"
                    style={{ backgroundColor: ("#" + note.color) }}
                    key={index}
                    id={"note-" + index}
                    draggable
                    onDragStart={() => { document.getElementById("note-" + index)?.classList.add("dragging") }}
                    onDragEnd={() => { document.getElementById("note-" + index)?.classList.remove("dragging") }}
                >
                    <input name={"note-title-" + index} className="note-title input-transparent" value={note.title} onChange={(e) => editTitleNote(index, e.target.value)} />
                    <textarea name={"note-content-" + index} className="note-content input-transparent input-textarea" value={note.content} onChange={(e) => editContentNote(index, e.target.value)} />
                    <div className='note-buttons'>
                        <input name={"note-color-" + index} className='color-picker' type="color" value={"#" + note.color} onChange={(e) => editColorNote(index, e.target.value.substring(1))} />
                        <div className='note-share' onClick={() => { shareNote(index) }} />
                        <div className='note-delete' onClick={() => { deleteNote(index) }} />
                        <div className='note-delete-for-everyone' onClick={() => { deleteNoteForEveryone(index) }} />
                    </div>
                </div>)}
            />
        </div>
    }

    function addNote() {
        requester("/notes", "POST", { title: "Nouvelle note", content: "", color: "ffffff" });
        window.location.reload();
    }

    function deleteNote(index: number) {
        let user_id = localStorage.getItem('user_id');
        requester("/user-notes", "PATCH", { note: notes[index]._id, user: user_id });
        setNotes(notes.filter((n, i) => i !== index))
    }

    function deleteNoteForEveryone(index: number) {
        requester("/notes?_id=" + notes[index]._id, "DELETE");
        setNotes(notes.filter((n, i) => i !== index))
    }

    function shareNote(index: number) {
        clearSelectedUsers();
        setSelectedNoteIndex(index);
        document.getElementById("user-popup-container")?.style.setProperty("display", "flex");
    }

    function shareNoteWithUsers() {
        let user_ids = [localStorage.getItem('user_id')];
        for (let i = 0; i < users.length; i++) {
            let user = document.getElementById("user-" + i) as HTMLInputElement;
            if ((user).checked) {
                user_ids.push((user).value);
                requester("/user-notes", "POST", { note: notes[selectedNoteIndex]._id, user: (user).value });
            }
        }
        setSelectedNoteIndex(-1);
        document.getElementById("user-popup-container")?.style.setProperty("display", "none");
    }

    function clearSelectedUsers() {
        for (let i = 0; i < users.length; i++) {
            let user = document.getElementById("user-" + i) as HTMLInputElement;
            user.checked = false;
        }
    }

    function editTitleNote(index: number, title: string) {
        let editedNote = notes[index];
        editedNote.title = title;
        setNotes(notes.map((n, i) => { if (i === index) { n.title = title }; return n }));
        requester("/notes", "PUT", editedNote);
    }

    function editContentNote(index: number, content: string) {
        let editedNote = notes[index];
        editedNote.content = content;
        setNotes(notes.map((n, i) => { if (i === index) { n.content = content }; return n }));
        requester("/notes", "PUT", editedNote);
    }

    function editColorNote(index: number, color: string) {
        let editedNote = notes[index];
        editedNote.color = color;
        setNotes(notes.map((n, i) => { if (i === index) { n.color = color }; return n }));
        requester("/notes", "PUT", editedNote);
    }

    function saveNotesOrder(n: note[]) {
        let ids = n.map((note) => note._id);
        requester("/user-notes", "PUT", ids);
    }

    /* ========*
     *  Events *
     * ========*/
    function eventsToHTML(): JSX.Element {
        return <div id="events">
            {events.map((event, index) => <div className="event" key={index}>{event.title}</div>)}
        </div>
    }

    /* ===========*
     *  Favorites *
     * ===========*/
    function favoritesToHTML(): JSX.Element {
        return <div id="favorites">
            {favorites.map((favorite, index) => <a className="favorite" key={index} href={favorite.url}>{favorite.title}</a>)}
        </div>
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

        <div id='user-popup-container'>
            <div id="users-popup">
                <h3 id='users-title'>Utilisateurs</h3>
                <ul id='users-list'>
                    {users.map((user, index) => <li key={index} className='user' style={{ display: user._id !== localStorage.getItem("user_id") ? "flex" : "none" }}>
                        <label htmlFor={"user-" + index}>{user.pseudo}</label>
                        <input type="checkbox" id={"user-" + index} name={"user-" + index} value={user._id} />
                    </li>)}
                </ul>
                <div id='users-buttons'>
                    {button({ text: "Annuler", del: true, onClick: () => { document.getElementById("user-popup-container")?.style.setProperty("display", "none"); clearSelectedUsers() } })}
                    {button({ text: "Partager", onClick: () => { shareNoteWithUsers() } })}
                </div>
            </div>
        </div>
    </div>
}

export default Home