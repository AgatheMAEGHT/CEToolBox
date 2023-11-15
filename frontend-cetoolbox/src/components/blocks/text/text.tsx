import React from 'react';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex'

import './text.css';

function BlockText() {
    const [value, setValue] = React.useState<string | undefined>(``);
    const [showText, setShowText] = React.useState<boolean>(false);

    return (
        <div className='block'>
            {showText && <textarea className='block-text-text' value={value} onChange={(e) => setValue(e.target.value)} />}
            <div className='block-text-preview' style={showText ? { width: "50%" } : {}}>
                <img alt="double-arrow" className="block-hide-arrow" src='/double-arrow.svg' style={showText ? {} : { transform: "rotate(180deg)" }} onClick={() => setShowText(!showText)} />
                <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, [rehypeHighlight, { fragment: true }], [rehypeRaw, { allowDangerousHtml: true }]]}>{value}</Markdown>
            </div>
        </div>
    );
}

export default BlockText;