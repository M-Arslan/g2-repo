import React from 'react';
import {
    convertFromHTML,
    convertToRaw,
    EditorState,
    ContentState
} from 'draft-js';
import {
    Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    ensureNonEmptyString,
    ensureNonNullObject,
} from '../../../../Core/Utility/rules';
import {
    makeEvent
} from '../../../../Core/Utility/makeEvent';

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

function getWrapperTag(type) {
    switch (type) {
        case 'unordered-list-item': return 'ul';
        case 'ordered-list-item': return 'ol';
        default: return '';
    }
}

function makeTag(tag, attr = "") {
    return (ensureNonEmptyString(tag) ? `<${tag} ${attr}>` : '');
}

function makeCloseTag(tag) {
    return (ensureNonEmptyString(tag) ? `</${tag}>` : '');
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

/**
 *
 * @param {import('draft-js').RawDraftContentBlock} block
 * @param {number} index
 */
//function validStylesAt(block, index) {
//    return block.inlineStyleRanges.filter(s => s.offset <= index && index > (s.offset + s.length)).map(s => toCss(s.style)).join('');
//}

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

/** Preset Buttons for the HtmlInput toolbar */
export const TOOLBAR_BUTTONS = {
    /** STYLING applies font styles like Bold, Italic, Underline, etc. */
    STYLING: 'inline',

    /** FONT_SIZE applies the font sizing to the selected text */
    FONT_SIZE: 'fontSize',

    /** FONT_FAMILY applies selected font to the selected text */
    FONT_FAMILY: 'fontFamily',

    /** COLOR_PICKER allows applying font color or highlight color to selected text */
    COLOR_PICKER: 'colorPicker',

    /** TEXT_ALIGN aligns text horizontally */
    TEXT_ALIGN: 'textAlign',

    /** LISTS allows creation of ordered and unordered lists */
    LISTS: 'list',

    /** ERASE removes formatting from selected text */
    ERASE: 'remove',

    /** BLOCK_TYPE applies Header Block styling to selected text */
    BLOCK_TYPE: 'blockType',
};

export const HtmlInput = ({ id, value, label, onBlur, readonly = false, required = false, error = false, helperText = null, toolbarButtons = null }) => {

    /** @type{[EditorState, Function]} */
    const [state, setState] = React.useState(EditorState.createEmpty());

    /** @type {[Array<string>, Function]} */
    const [toolbar, setToolbar] = React.useState(['inline', 'list', 'textAlign', 'remove']);
    let editorRef;
    const initContent = (content) => {
        let contentState = null;

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
            console.log('ContentState:', contentState);
            const es = (contentState == null ? EditorState.createEmpty() : EditorState.createWithContent(contentState));
            setState(es);
        }
    }

    React.useEffect(() => {
        if (Array.isArray(toolbarButtons) && toolbarButtons.every(tb => ensureNonEmptyString(tb))) {
            setToolbar(toolbarButtons);
        }
    }, [toolbarButtons]);

    React.useEffect(() => {
        console.log('Init content:', value);
        initContent(value);
    }, [value]);

    const editorBlur = () => {
        const content = state.getCurrentContent();
        const html = (content.hasText() ? renderHtml(convertToRaw(content)) : '');

        if (typeof onBlur === 'function') {
            onBlur(makeEvent(id, html));
        }
    }

    const setEditorRef = (ref) => {
        if (ensureNonNullObject(ref) && typeof ref.focus === 'function') {
            editorRef = ref;
        }
    }

    return <div className="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
        <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-marginDense MuiInputLabel-outlined MuiFormLabel-filled" data-shrink="true" htmlFor={id} id={`${id}_label`}>{label}</label>
        <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-marginDense MuiOutlinedInput-marginDense">
            <div style={{ width: '100%', height: '100%', padding: '0', paddingTop: '.5em', overflow: 'auto', border: 'solid 1px #000', borderRadius: '4px' }}>
            <Editor
                toolbar={{
                    options: toolbar,
                }}
                editorState={state}
                onEditorStateChange={setState}
                editorRef={setEditorRef}
                wrapperStyle={{ padding: 0, height: '100%', width: '100%' }}
                toolbarStyle={{ backgroundColor: '#ddd', margin: 0, padding: 0, borderBottom: 'solid 1px #a1a1a1', width: '100%' }}
                editorStyle={{ border: 'solid 1px #efefef', backgroundColor: '#fefefe', borderRadius: '4px', height: 'calc(100% - 65px)', width: '100%', overflow: 'visible', padding: '.25em' }}
                spellCheck={true}
                onBlur={editorBlur}
                />
            </div>
        </div>
    </div>;
};