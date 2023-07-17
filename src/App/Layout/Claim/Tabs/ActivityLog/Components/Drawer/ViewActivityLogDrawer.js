import {
    ContentState,
    convertFromHTML,
    convertFromRaw, EditorState
} from 'draft-js';
import React from 'react';
import {
    Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    ensureNonEmptyString,
    ensureNonNullObject
} from '../../../../../../Core/Utility/rules';
import {
    safeObj
} from '../../../../../../Core/Utility/safeObject';
import {
    FormDrawer
} from '../../../../../Common/Components/FormDrawer';

export const ViewActivityLogDrawer = ({ open, onClose, content }) => {

    const [state, setState] = React.useState(EditorState.createEmpty());

    const initContent = (entry) => {
        let contentState = null;
        const content = safeObj(entry).narrative;

        try {
            const raw = safeObj(entry).raw;
            if (ensureNonEmptyString(raw) && raw.startsWith('{')) {
                contentState = convertFromRaw(JSON.parse(raw));
            }
            else {
                const blocksFromHTML = convertFromHTML((content || ''));

                contentState = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap,
                );
            }
        }
        catch (e) {
            console.warn('Error loading from state:', e);
            contentState = ContentState.createFromText((ensureNonEmptyString(content) ? content : ''));
        }
        finally {
            const es = (contentState == null ? EditorState.createEmpty() : EditorState.createWithContent(contentState));
            setState(es);
        }
    }

    const clearContent = () => setState(EditorState.createEmpty());

    React.useEffect(() => {
        if (ensureNonNullObject(content)) {
            initContent(content);
        }

        return () => clearContent();
    }, [content]);

    const closeDrawer = () => {
        if (typeof onClose === 'function') {
            onClose();
        }

        setState(EditorState.createEmpty());
    }

    return <FormDrawer open={open} options={{ width: '50%', hideFooter: true, title: `${safeObj(content).createdByDisplayName} - ${safeObj(content).userCreatedDate}` }} onSubmit={closeDrawer} onClose={closeDrawer}>
        <div style={{ padding: '.5em' }}>
            <Editor
                toolbar={{
                    options: [],
                }}
                editorState={state}
                wrapperStyle={{ padding: 0, height: '100%', width: '100%' }}
                toolbarStyle={{ backgroundColor: '#ddd', margin: 0, padding: 0, borderBottom: 'solid 1px #a1a1a1', width: '100%' }}
                editorStyle={{ border: 'solid 1px #efefef', backgroundColor: '#fefefe', borderRadius: '4px', height: 'calc(100% - 65px)', width: '100%', overflow: 'visible', padding: '.25em' }}
                readOnly={true}
            />

        </div>
    </FormDrawer>;
};