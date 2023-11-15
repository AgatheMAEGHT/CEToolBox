import React from 'react';
import { useNavigate } from 'react-router-dom';

import './docs.css';
import BlockText from '../../components/blocks/text/text';


function Docs() {
    let navigate = useNavigate();
    const [showLeft, setShowLeft] = React.useState<boolean>(true);
    const [showLeftMarkdown, setShowLeftMarkdown] = React.useState<boolean>(true);
    const [showLeftColors, setShowLeftColors] = React.useState<boolean>(true);
    const [numberBlock, setNumberBlock] = React.useState<number>(0);

    const [pageContent, setPageContent] = React.useState<{ elt: JSX.Element, id: number }[]>([]);

    function deleteBlock(id: number): void {
        setPageContent(prev => prev.filter((_, i) => i !== id));
        setNumberBlock(prev => prev - 1);
    }

    function displayPage(): JSX.Element {
        let page: JSX.Element[] = [];

        pageContent.forEach((elt) => {
            page.push(elt.elt);
        });

        return <div>{page}</div>;
    }

    return <div id="docs" className='page'>
        <div id="docs-content">
            {showLeft && <div id="docs-left">
                <img alt="double-arrow" className="docs-double-arrow" id="docs-hide-left" src='/double-arrow.svg' onClick={() => setShowLeft(false)} />

                <h4 className='docs-infos-title' onClick={() => setShowLeftMarkdown(!showLeftMarkdown)}>Infos Markdown</h4>
                {showLeftMarkdown && <div className="docs-infos">
                    <p><b>Titres :</b> {"##"}</p>
                    <p><b>Citation :</b> {"<blockquote><blockquote/>"}</p>
                    <p><b>Tableau :</b> <br />
                        | Col1 | Col2 | <br />
                        | ----: | :----- |<br />
                        | AAA | BBB |<br />
                        | CCC | DDD |
                    </p>
                    <p><b>Code :</b> {"```ext xxx ```"}</p>
                    <p><b>KaTeX :</b> {"`$$ xxx $$`"}</p>
                </div>}

                <hr className='docs-infos-line' />

                <h4 className='docs-infos-title' onClick={() => setShowLeftColors(!showLeftColors)}>Couleurs</h4>
                {showLeftColors && <div className="docs-infos">
                    <p>
                        Les couleurs sont à mettre comme class d'une balise html  : <br />
                        {`<div class="Couleur"> </div>`}
                    </p>
                    <p className='docs-infos-color Blanc'>Blanc</p>
                    <p className='docs-infos-color Noir'>Noir</p>
                    <p className='docs-infos-color Gris' >Gris</p>
                    <p className='docs-infos-color Marron' >Marron</p>
                    <p className='docs-infos-color Orange' >Orange</p>
                    <p className='docs-infos-color Jaune' >Jaune</p>
                    <p className='docs-infos-color Vert' >Vert</p>
                    <p className='docs-infos-color Turquoise' >Turquoise</p>
                    <p className='docs-infos-color Cyan' >Cyan</p>
                    <p className='docs-infos-color Bleu' >Bleu</p>
                    <p className='docs-infos-color Violet' >Violet</p>
                    <p className='docs-infos-color Bordeaux' >Bordeaux</p>
                    <p className='docs-infos-color Rose' >Rose</p>
                    <p className='docs-infos-color Rouge' >Rouge</p>
                </div>}
            </div>}

            <div id="docs-right">
                {!showLeft && <img alt="double-arrow" className="docs-double-arrow" id="docs-show-left" src='/double-arrow.svg' onClick={() => setShowLeft(true)} />}
                {pageContent}
                <div id="docs-content-add">
                    <p className='docs-content-add-elt' onClick={() => setPageContent(prev => [...prev, <BlockText id={numberBlock} delete={deleteBlock} />])}>Texte</p>
                    <p className='docs-content-add-elt' onClick={() => setPageContent(prev => [...prev, <BlockText id={numberBlock} delete={deleteBlock} />])}>Mermaid</p>
                    <p className='docs-content-add-elt' onClick={() => setPageContent(prev => [...prev, <BlockText id={numberBlock} delete={deleteBlock} />])}>Tableau</p>
                    <p className='docs-content-add-elt' onClick={() => setPageContent(prev => [...prev, <BlockText id={numberBlock} delete={deleteBlock} />])}>Code</p>
                </div>
            </div>
        </div>
    </div>
}

export default Docs;