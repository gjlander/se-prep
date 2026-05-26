// import marked-react and react-refractor
// for styling to apply, you will need to copy the contents of index.css
import Markdown from 'marked-react';
import { Refractor, registerLanguage } from 'react-refractor';

// import languages you want to support highlighting for
import bash from 'refractor/lang/bash';
import js from 'refractor/lang/javascript.js';
import php from 'refractor/lang/php.js';
import python from 'refractor/lang/python.js';

//register each language
registerLanguage(bash);
registerLanguage(js);
registerLanguage(php);
registerLanguage(python);

// create a renderer object to pass to the markdown component
const renderer = {
    code(snippet, lang) {
        // if no lang given, default to bash
        if (!lang) lang = 'bash';
        const allowedLangs = ['js', 'php', 'python'];
        // if language isn't one of the allowed, default to bash
        if (!allowedLangs.includes(lang)) lang = 'bash';
        // return Refractor component, and pass the lang and snippet
        return (
            <Refractor key={this.elementId} language={lang} value={snippet} />
        );
    },
};

const ChatMarkdown = ({ dataResult }) => {
    return (
        <div
            id='results'
            className='h-2/3 w-full p-8 bg-slate-600 rounded-lg shadow-md'
        >
            {dataResult && (
                // Use Markdown component, and pass it the renderer
                // gfm stands for "GitHub flavored markdown"
                // Render the text inside
                <Markdown gfm renderer={renderer}>
                    {dataResult}
                </Markdown>
            )}
        </div>
    );
};

export default ChatMarkdown;
