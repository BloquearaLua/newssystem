import React,{ useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("");
    useEffect(() => {
        const { content } = props;
        // console.log(content);
        if (content === undefined) return;
        const contentBlock = htmlToDraft(content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props]);
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => { setEditorState(editorState) }}
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />
        </div>
    )
}
