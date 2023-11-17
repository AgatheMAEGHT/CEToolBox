import React from 'react';

import Markdown from 'react-markdown'; // to display markdown
import remarkGfm from 'remark-gfm'; // to allow tables in markdown
import rehypeKatex from 'rehype-katex'; // to allow katex in markdown
import rehypeRaw from 'rehype-raw'; // to allow html in markdown

import { blockText } from '../../types';

import './markdown.css';

function BlockText(props: blockText) {
    const [value, setValue] = React.useState<string | undefined>(props.content);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <textarea className='block-text' value={value} onChange={(e) => setValue(e.target.value)} />}
            <div className='block-preview' style={showText ? { width: "50%" } : { width: "100%" }}>
                <div className='block-icon-area'>
                    <img alt="double-arrow" className="block-icon block-icon-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                </div>
                <div>
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeKatex, { displayMode: true }], [rehypeRaw, { allowDangerousHtml: true }]]}>{value}</Markdown>
                </div>
            </div>
        </div>
    );
}

export default BlockText;