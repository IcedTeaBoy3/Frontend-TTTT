// ViewerCKeditorStyled.jsx
import DOMPurify from 'dompurify';
import { StyledCKEditor } from './style';

const ViewerCKeditorStyled = ({ content = '' }) => {
    const contentSanitized = DOMPurify.sanitize(content); // giữ nguyên class/style
    return (
        <StyledCKEditor
            dangerouslySetInnerHTML={{ __html: contentSanitized }}
        />
    );
};

export default ViewerCKeditorStyled;
