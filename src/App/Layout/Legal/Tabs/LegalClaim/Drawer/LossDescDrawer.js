import React from 'react';
import {
    EditorState,
    ContentState,
    convertToRaw
} from 'draft-js';
import {
    Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { FormDrawer } from '../../../../../../App/Layout/Common/Components/FormDrawer'
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../Core/Utility/rules';
import { useNotifications } from "../../../../../Core/Providers/NotificationProvider/NotificationProvider"
import {
    convertFromHTML,
} from 'draft-js';


// HTML Rendering Functions


/**
 *
 * @param {string} type
 */
function getBlockTag(type) {
    switch (type) {
        case 'header-one': return 'h1';
        case 'header-two': return 'h2';
        case 'header-three': return 'h3';
        case 'header-four': return 'h4';
        case 'header-five': return 'h5';
        case 'header-six': return 'h6';
        case 'unordered-list-item': return 'li';
        case 'ordered-list-item': return 'li';
        case 'blockquote': return 'blockquote';
        case 'code-block': return 'pre';
        default: return 'p';
    }
}

/**
 *
 * @param {import('react-draft-wysiwyg').RawDraftContentState} state
 */
function renderHtml(state) {

    let wrapper = '';
    let output = [];

    for (let i = 0; i < state.blocks.length; i++) {
        const block = state.blocks[i];
        const w = getWrapperTag(block.type);

        if (wrapper !== w) {
            if (ensureNonEmptyString(wrapper)) {
                output.push((ensureNonEmptyString(wrapper) ? `</${wrapper}>` : ''));
            }
            output.push((ensureNonEmptyString(w) ? `<${w}>` : ''));
            wrapper = w;
        }

        output.push(renderBlock(block));
    }

    if (ensureNonEmptyString(wrapper)) {
        output.push(`</${wrapper}>`);
    }

    return output.flat().join('');
}
function getWrapperTag(type) {
    switch (type) {
        case 'unordered-list-item': return 'ul';
        case 'ordered-list-item': return 'ol';
        default: return '';
    }
}

/**
 *
 * @param {import('draft-js').RawDraftContentBlock} block
 * @param {number} index
 */


/**
 *
 * @param {import('draft-js').RawDraftContentBlock} block
 */
function renderBlock(block) {
    const text = block.text;
    let styledText = '<span>';

    for (let i = 0; i < text.length; i++) {
        const closing = (block.inlineStyleRanges.filter(s => (i === (s.offset + s.length) || i === s.offset)).length > 0);
        const applicable = block.inlineStyleRanges.filter(s => (s.offset <= i && i <= (s.offset + s.length - 1)));

        if (closing) {
            // -- write all still applicable styles after the closing tag
            styledText += `</span><span style="${applicable.reduce((str, style) => {
                return `${str}${toCss(style.style)}`;
            }, '')}">${text[i]}`;
        }
        else {
            styledText += text[i];
        }
    }

    const attr = (ensureNonNullObject(block.data) && Object.keys(block.data).length > 0 ? `style="${Object.keys(block.data).map(k => `${k}: ${block.data[k]}`).join(';')};"` : '');

    return `${makeTag(getBlockTag(block.type), attr)}${styledText}</span>${makeCloseTag(getBlockTag(block.type))}`;
}
function makeTag(tag, attr = "") {
    return (ensureNonEmptyString(tag) ? `<${tag} ${attr}>` : '');
}


function makeCloseTag(tag) {
    return (ensureNonEmptyString(tag) ? `</${tag}>` : '');
}

/**
 * 
 * @param {string} str
 */
function toCss(str) {
    if (str === 'BOLD') {
        return 'font-weight: bold;';
    }
    else if (str === 'ITALIC') {
        return 'font-style: italic;';
    }
    else if (str === 'UNDERLINE') {
        return 'text-decoration: underline;';
    }
    else if (str === 'STRIKETHROUGH') {
        return 'text-decoration: line-through;';
    }
    else if (str === 'CODE') {
        return 'font-family: monospace;';
    }
    else if (str === 'SUPERSCRIPT') {
        return 'vertical-align: super;font-size: smaller;line-height: normal;';
    }
    else if (str === 'SUBSCRIPT') {
        return 'vertical-align: sub;font-size: smaller;line-height: normal;';
    }
    else if (str.startsWith('bgcolor-')) {
        return `background-color: ${str.split('-')[1]};`;
    }
    else if (str.startsWith('fontfamily-')) {
        return `font-family: ${str.split('-')[1]};`;
    }
    else if (str.startsWith('fontsize-')) {
        return `font-size: ${str.split('-')[1]};`;
    }
    else if (str.startsWith('color-')) {
        return `color: ${str.split('-')[1]};`;
    }
    else {
        return '';
    }
}

function stripTags(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}


// End Functions 



export const LossDescDrawer = ({ open, onClose, content, legalclaim, claims, isViewer }) => {
    const [lossDesc, setLossDesc] = React.useState(EditorState.createEmpty());
    const $notifications = useNotifications();

    let editorRef;

    React.useEffect(() => {

        /* let contentState = null;
         contentState = ContentState.createFromText(content);
         const es = (contentState == null ? EditorState.createEmpty() : EditorState.createWithContent(contentState));
         setLossDesc(es);*/

    }, [])


    const initContent = (entry) => {
        let contentState = null;
        const content = entry;

        try {
            const blocksFromHTML = convertFromHTML((content || ''));
            contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
        }
        catch (e) {
            console.warn('Error loading from state:', e);
            contentState = ContentState.createFromText((ensureNonEmptyString(content) ? content : ''));
        }
        finally {
            const es = (contentState == null ? EditorState.createEmpty() : EditorState.createWithContent(contentState));
            setLossDesc(es);
        }
    }

    React.useEffect(() => {
        focusEditor();
        initContent(content);
    }, [content]);


    const submitForm = () => {

        const content = lossDesc.getCurrentContent();

        if (content.hasText()) {
            const htmlContent = renderHtml(convertToRaw(content));
            if (ensureNonEmptyString(stripTags(htmlContent)?.trim())) {
                if (typeof onClose === 'function') {
                    onClose({ confirmed: true, content: htmlContent });
                }
            }
            else {
                $notifications.notifyError('You must enter some text before submitting the Loss Description');
            }
        }
        else {
            $notifications.notifyError('You must enter some text before submitting the Loss Description');
        }
    }

    const closeDrawer = () => {
        if (typeof onClose === 'function') {
            onClose({ confirmed: false });
        }
    }

    const focusEditor = () => {
        if (ensureNonNullObject(editorRef) && typeof editorRef.focus === 'function') {
            editorRef.focus();
        }
    };
    const setEditorRef = (ref) => {
        if (ensureNonNullObject(ref) && typeof ref.focus === 'function') {
            editorRef = ref;
            ref.focus();

        }
    }




    return (
        <>
            <FormDrawer open={open} options={{ width: '50%', title: `Go Back` }} onClose={closeDrawer} onSubmit={submitForm} >
                <div style={{ width: '100%', height: '100%', padding: '0', overflow: 'auto' }} onClick={focusEditor} >
                    <Editor
                        toolbar={isViewer ? { options: [] } : {
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove'],
                        }}
                        onEditorStateChange={setLossDesc}
                        editorState={lossDesc}
                        editorRef={setEditorRef}
                        wrapperStyle={{ padding: 0, height: '100%', width: '100%' }}
                        toolbarStyle={{ backgroundColor: '#ddd', margin: 0, padding: 0, borderBottom: 'solid 1px #a1a1a1', width: '100%' }}
                        editorStyle={{ border: 'solid 1px #efefef', backgroundColor: '#fefefe', borderRadius: '4px', height: 'calc(100% - 65px)', width: '100%', overflow: 'auto', padding: '.25em' }}
                        spellCheck={true}
                        readOnly={isViewer}

                    />
                </div>
            </FormDrawer>

        </>
    )

}
