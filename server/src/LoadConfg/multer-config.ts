import { diskStorage } from 'multer';

export const MulterOptions = {
    // Enable file size limits
    limits: {
        fileSize: 10000000000000,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    // Storage properties
    storage: diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req: any, file, cb) {
            const timestamp = new Date().getTime().toString();
            // tslint:disable-next-line: no-console
            cb(null, `${timestamp}.png`);
        },
    }),
}