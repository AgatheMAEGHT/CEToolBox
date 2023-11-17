import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { languageList } from './languages';
import { blockCode } from '../../types';

import './code.css';

function BlockCode(props: blockCode) {
    const [value, setValue] = React.useState<string>(props.content);
    const [langage, setLangage] = React.useState<string | undefined>(props.langage);
    const [showCode, setShowCode] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showCode &&
                <div className='block-code-ide'>
                    <select className='block-code-language' value={langage} onChange={(e) => setLangage(e.target.value)}>
                        {languageList.map((langage) => <option value={langage}>{langage}</option>)}
                    </select>
                    <textarea className='block-code-text' value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
            }
            <div className='block-preview' style={showCode ? { width: "50%" } : { width: "100%" }}>
                <div className='block-icon-area'>
                    <img alt="double-arrow block-icon-arrow" className="block-icon" src='/double-arrow.svg' style={showCode ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowCode(!showCode)} />
                </div>
                <div>
                    <SyntaxHighlighter language={langage} style={nightOwl} showLineNumbers wrapLongLines >{value}</SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}

export default BlockCode;