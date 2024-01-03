import React from 'react';

import BlockText from '../../components/blocks/markdown/markdown';
import BlockKatex from '../../components/blocks/katex/katex';
import BlockCode from '../../components/blocks/code/code';
import BlockImage from '../../components/blocks/image/image';
import BlockTable from '../../components/blocks/table/table';
import { blockType, docType } from '../../components/types';

import './page.css';

function Page() {
    const [showLeft, setShowLeft] = React.useState<boolean>(true);
    const [showLeftMarkdown, setShowLeftMarkdown] = React.useState<boolean>(false);
    const [showLeftColors, setShowLeftColors] = React.useState<boolean>(false);
    const [showLeftKaTeX, setShowLeftKaTeX] = React.useState<boolean>(false);

    const [pageContent, setPageContent] = React.useState<docType>([]);


    let test: string[][] = [["100", "150", "200"], ["30", "30", "30", "30"], [`z`, `a`, `b`, `c`], [`d\n
    \na`, `e`, `f`, "block"], [`g`, `h`, `i`, "bluck"]];

    function deleteBlock(id: number): void {
        console.log("the deleted id : " + id);
        setPageContent(prev => prev.filter(block => block.id !== id));
    }

    function displayPage(): JSX.Element {
        let page: JSX.Element[] = [];

        pageContent.forEach((elt) => {
            page.push(elt.content);
        });

        return <div id="doc-block-list">{page}</div>;
    }

    function addBlock(type: string, attributeStr0: string, attributeStr1?: string, attributeStr2?: string, attributeTable?: string[][]): void {
        let id: number = pageContent?.length ? pageContent[pageContent.length - 1].id + 1 : 0;
        let contentBlock: JSX.Element =
            type === "markdown" ? <BlockText content={attributeStr0} /> :
                type === "table" ? <BlockTable content={attributeTable} /> :
                    type === "image" ? <BlockImage content={attributeStr0} size={attributeStr1} align={attributeStr2} /> :
                        type === "code" ? <BlockCode content={attributeStr0} langage={attributeStr1} /> :
                            type === "katex" ? <BlockKatex content={attributeStr0} /> :
                                <div></div>;

        let block: blockType = {
            content:
                <div className='doc-block-area' key={id}>
                    {contentBlock}
                    <div className="block-icon-area">
                        <img alt="bin" className="block-icon-bin block-icon" src='/bin.png' onClick={() => { deleteBlock(id) }} />
                    </div>
                </div>,
            type: type,
            id: id
        }
        setPageContent(prev => [...prev, block])
    }

    return <div id="docs" className='page'>
        <div id="docs-content">
            {showLeft && <div id="docs-left">
                <img alt="double-arrow" className="docs-double-arrow" id="docs-hide-left" src='/double-arrow.svg' onClick={() => setShowLeft(false)} />

                <h4 className='docs-infos-title' onClick={() => setShowLeftMarkdown(!showLeftMarkdown)}>Infos Markdown</h4>
                {showLeftMarkdown && <div className="docs-infos">
                    <p className="docs-infos-text"><b>Titres :</b> {"##"}</p>
                    <p className="docs-infos-text"><b>Citation :</b> {"<blockquote><blockquote/>"}</p>
                    <p className="docs-infos-text"><b>Tableau :</b> <br />
                        | Col1 | Col2 | <br />
                        | ----: | :----- |<br />
                        | AAA | BBB |<br />
                        | CCC | DDD |
                    </p>
                    <p className="docs-infos-text"><b>Code :</b> {"```ext xxx ```"}</p>
                    <p className="docs-infos-text"><b>KaTeX :</b> {"`$$ xxx $$`"}</p>
                </div>}

                <hr className='docs-infos-line' />

                <h4 className='docs-infos-title' onClick={() => setShowLeftColors(!showLeftColors)}>Couleurs</h4>
                {showLeftColors && <div className="docs-infos">
                    <p className="docs-infos-text">
                        Les couleurs sont à mettre comme class d'une balise html  : <br />
                        {`<div class="Couleur"> </div>`}
                    </p>
                    <p className='docs-infos-text docs-infos-color Blanc'>Blanc</p>
                    <p className='docs-infos-text docs-infos-color Noir'>Noir</p>
                    <p className='docs-infos-text docs-infos-color Gris' >Gris</p>
                    <p className='docs-infos-text docs-infos-color Marron' >Marron</p>
                    <p className='docs-infos-text docs-infos-color Orange' >Orange</p>
                    <p className='docs-infos-text docs-infos-color Jaune' >Jaune</p>
                    <p className='docs-infos-text docs-infos-color Vert' >Vert</p>
                    <p className='docs-infos-text docs-infos-color Turquoise' >Turquoise</p>
                    <p className='docs-infos-text docs-infos-color Cyan' >Cyan</p>
                    <p className='docs-infos-text docs-infos-color Bleu' >Bleu</p>
                    <p className='docs-infos-text docs-infos-color Violet' >Violet</p>
                    <p className='docs-infos-text docs-infos-color Bordeaux' >Bordeaux</p>
                    <p className='docs-infos-text docs-infos-color Rose' >Rose</p>
                    <p className='docs-infos-text docs-infos-color Rouge' >Rouge</p>
                </div>}

                <hr className='docs-infos-line' />

                <h4 className='docs-infos-title' onClick={() => setShowLeftKaTeX(!showLeftKaTeX)}>KaTeX</h4>
                {showLeftKaTeX && <div className="docs-infos">
                    <p className="docs-infos-text"><b>Newline :</b> {"\\\\"}</p>
                    <p className="docs-infos-text"><b>Ligne vide :</b> {"\\text { }\\\\"}</p>
                    <p className="docs-infos-text"><b>Intégrale :</b> {"\\int_a^b"}</p>
                    <p className="docs-infos-text"><b>Fraction :</b> {"\\frac {} {}"}</p>
                    <p className="docs-infos-text"><b>⇔ :</b> {"\\Leftrightarrow"}</p>
                    <p className="docs-infos-text"><b>√ :</b> {"\\sqrt"}</p>
                    <p className="docs-infos-text"><b>φ :</b> {"\\Phi"}</p>
                    <p className="docs-infos-text"><b>ϕ :</b> {"\\phi"}</p>
                    <p className="docs-infos-text"><b>Équation alignée : </b><br />
                        {"\\begin{equation}"}<br />
                        {"\\begin{split}"}<br />
                        a&b<br />
                        &b&c<br />
                        {"\\end{split}"}<br />
                        {"\\end{equation}"}
                    </p>
                </div>}
            </div>}

            <div id="docs-right">
                {!showLeft && <img alt="double-arrow" className="docs-double-arrow" id="docs-show-left" src='/double-arrow.svg' onClick={() => setShowLeft(true)} />}
                {displayPage()}
                <div id="docs-content-add">
                    <p className='docs-content-add-elt' onClick={() => addBlock("markdown", "")}>Markdown</p>
                    <p className='docs-content-add-elt' onClick={() => addBlock("table", "", undefined, undefined, test)}>Tableau</p>
                    <p className='docs-content-add-elt' onClick={() => addBlock("image", "", "", "")}>Image</p>
                    <p className='docs-content-add-elt' onClick={() => addBlock("code", "", "")}>Code</p>
                    <p className='docs-content-add-elt' onClick={() => addBlock("katex", "")}>KaTeX</p>
                    <p className='docs-content-add-elt' onClick={() => addBlock("mermaid", "")}></p>
                </div>
            </div>
        </div>
    </div>
}

export default Page;