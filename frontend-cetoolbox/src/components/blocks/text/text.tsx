import React from 'react';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

import './text.css';

function BlockText() {

    const [value, setValue] = React.useState<string | undefined>(`
### Test
This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\``);

    return (
        <div className='block-text'>

            <textarea className='block-text-text' value={value} onChange={(e) => setValue(e.target.value)} />
            <div className='block-text-preview'>
                <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeHighlight, {fragment: true}], rehypeKatex, [rehypeRaw, {allowDangerousHtml: true}] ]}>{value}</Markdown>
            </div>
        </div>
    );
}

export default BlockText;