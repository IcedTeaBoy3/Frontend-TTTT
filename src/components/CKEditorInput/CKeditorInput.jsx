import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from './CustomUploadAdapter';
const CKEditorInput = ({ value = '', onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={editor => {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                    return new CustomUploadAdapter(loader);
                };
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CKEditorInput;
