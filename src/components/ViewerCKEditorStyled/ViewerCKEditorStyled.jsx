// ViewerCKeditorStyled.jsx
import DOMPurify from 'dompurify';
import { StyledCKEditor } from './style';

const ViewerCKEditorStyled = ({ content = '' }) => {
    const contentSanitized = DOMPurify.sanitize(content); // giữ nguyên class/style
    return (
        <StyledCKEditor
            dangerouslySetInnerHTML={{ __html: contentSanitized }}
        />
    );
};

export default ViewerCKEditorStyled;
