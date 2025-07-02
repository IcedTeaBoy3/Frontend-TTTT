// ViewerCKeditorPlain.jsx
import DOMPurify from 'dompurify';

const ViewerCKEditorPlain = ({ content = '' }) => {
    // Bước 1: Làm sạch XSS
    const sanitized = DOMPurify.sanitize(content);

    // Bước 2: Loại bỏ toàn bộ thẻ HTML
    const plainText = sanitized.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    return (
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {plainText}
        </div>
    );
};

export default ViewerCKEditorPlain;
