export default class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(file => {
            const data = new FormData();
            data.append('upload', file); // tên field trùng với multer

            return fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(result => {
                    return { default: result.url }; // đường dẫn ảnh sau khi upload
                });
        });
    }

    abort() {
        // có thể không cần
    }
}
