import React from 'react';

import { blockType, docType } from '../../components/types';

import './lists.css';

function Lists() {
    const [showLeft, setShowLeft] = React.useState<boolean>(true);
    const [pageContent, setPageContent] = React.useState<docType>([]);
    const [list, setList] = React.useState<string[]>([]);

    function displayList(): JSX.Element {
        let page: JSX.Element[] = [];

        pageContent.forEach((elt) => {
            page.push(elt.content);
        });

        return <div id="doc-block-list">{page}</div>;
    }

    function displayListsList() {
        let tmpLists: JSX.Element[] = [];
        list.forEach((elt) => {
            tmpLists.push(<div>{elt}</div>);
        });
        return <div></div>
    }

    return <div id="docs" className='page'>
        <div id="docs-content">
            {showLeft && <div id="docs-left">
                <img alt="double-arrow" className="docs-double-arrow" id="docs-hide-left" src='/double-arrow.svg' onClick={() => setShowLeft(false)} />
                <h3>Liste des listes</h3>
                {displayListsList()}
            </div>}

            <div id="docs-right">
                {!showLeft && <img alt="double-arrow" className="docs-double-arrow" id="docs-show-left" src='/double-arrow.svg' onClick={() => setShowLeft(true)} />}
                {displayList()}
            </div>
        </div>
    </div>
}

export default Lists;