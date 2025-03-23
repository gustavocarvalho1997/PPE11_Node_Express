import { existsSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';

export const checkIfFileExists = async (file: string) => {
    const getFileName = file.split('/');
    const dir = path.join(__dirname, '../../public');

    if (existsSync(`${dir}/${getFileName[getFileName.length - 1]}`)) {
        return getFileName[getFileName.length - 1];
    }

    return '';
};

export const removeFileFromFolder = async (file: string) => {
    const dir = path.join(__dirname, '../../public');
    unlink(`${dir}/${file}`);
};

export const upload = multer({
    dest: path.join(__dirname, '../../public'),
    limits: {
        fileSize: 1000000,
    },
});
