import {
    convertToRaw,
    EditorState
} from 'draft-js';
import React from 'react';
import {
    Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    useNotifications
} from '../../../../../../Core/Providers/NotificationProvider/NotificationProvider/.';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    FormDrawer
} from '../../../../../Common/Components/FormDrawer';
import { CLAIM_TYPES } from '../../../../../../Core/Enumerations/app/claim-type';
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
function validStylesAt(block, index) {
    return block.inlineStyleRanges.filter(s => s.offset <= index && index > (s.offset + s.length)).map(s => toCss(s.style)).join('');
}

/**
 *
 * @param {import('draft-js').RawDraftContentBlock} block
 */
//function blockRender(block) {
//    const text = block.text;
//    const attr = Object.keys(block.data).map(k => `${k}: ${block.data[k]};`).join('');
//    const blockType = getBlockTag(block.type);

//    const output = [`<${blockType}${(ensureNonEmptyString(attr) ? ` ${attr}` : '')}>`];

//    const stops = [...(new Set(block.inlineStyleRanges.map(style => [style.offset, (style.offset + style.length - 1)]).flat()))].sort();

//    if (stops.length < 1 || stops[0] > 0) {
//        output.push(`<span>${(stops.length < 1 ? text : text.substring(0, stops[0]))}</span>`);
//    }

//    for (let i = 0; i < stops.length; i++) {
//        const stop = stops[i];
//        const styles = validStylesAt(block, stop);
//        const end = (i === (stops.length - 1) ? text.length : stop[i + 1]);
//        output.push(`<span style="${styles}">${text.substring(stop, end)}</span>`);

//    }

//    output.push(`</${blockType}>`);
//    return output;
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

export const AddActivityLogDrawer = ({ open, onClose, isSupervisor = false , claim }) => {

    const $notifications = useNotifications();

    /** @type{[EditorState, Function]} */
    const [state, setState] = React.useState(EditorState.createEmpty());

    let editorRef;

    React.useEffect(() => {
        focusEditor();
    }, []);

    function stripTags(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const submitForm = () => {
        const content = state.getCurrentContent();
        if (content.hasText()) {

            const htmlContent = renderHtml(convertToRaw(content));
            const raw = JSON.stringify(convertToRaw(content));

            if (ensureNonEmptyString(stripTags(htmlContent)?.trim())) {
                if (typeof onClose === 'function') {
                    onClose({ confirmed: true, content: htmlContent, raw, isSupervisor: (isSupervisor === true) });
                }
            }
            else {
                $notifications.notifyError('You must enter some text before submitting the Activity Log Narrative');
            }
            setState(EditorState.createEmpty());
        }
        else {
            $notifications.notifyError('You must enter some text before submitting the Activity Log Narrative');
        }
    }

    const closeDrawer = () => {
        if (typeof onClose === 'function') {
            onClose({ confirmed: false });
        }

        setState(EditorState.createEmpty());
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

    return <FormDrawer open={open} options={{ width: '50%', title: `New Claim Narrative - ${claim?.claimID} -- ${(ensureNonNullObject(claim) ? (ensureNonNullObject(claim.policy) ? `${claim.policy.insuredName || ''} ${claim.policy.insuredNameContinuation || ''}`?.trim() : (ensureNonNullObject(claim.claimPolicy) ? claim.claimPolicy.insuredName || '' : claim.claimType === CLAIM_TYPES.LEGAL ? claim.insuredName?.trim() : '--')) : '--')}` }} onSubmit={submitForm} onClose={closeDrawer}>
        <div style={{ width: '100%', height: '100%', padding: '0', overflow: 'auto' }} onClick={focusEditor}>
            <Editor
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove'],
                }}
                editorState={state}
                onEditorStateChange={setState}
                editorRef={setEditorRef}
                wrapperStyle={{ padding: 0, height: '100%', width: '100%' }}
                toolbarStyle={{ backgroundColor: '#ddd', margin: 0, padding: 0, borderBottom: 'solid 1px #a1a1a1', width: '100%' }}
                editorStyle={{ border: 'solid 1px #efefef', backgroundColor: '#fefefe', borderRadius: '4px', height: 'calc(100% - 65px)', width: '100%', overflow: 'auto', padding: '.25em' }}
                spellCheck={true}
            />
        </div>
    </FormDrawer>;
};