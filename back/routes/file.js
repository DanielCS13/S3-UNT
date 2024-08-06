import express from 'express';
import { uploadFile, getFiles, getFile, downloadFile, getFileURL, uploadFileWithID, deleteFile } from "./../s3.js"

import File from '../models/File.js';
import User from '../models/User.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const fileInMongo = await File.find();
        const fileInMongoWithUrl = fileInMongo.map(file => {
            return {
                ...file._doc,
                url: getFileURL("AD" + file._id)
            }
        })
        res.json(fileInMongoWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:idInstitution', async (req, res) => {
    try {
        // Encuentra los archivos que coinciden con idInstitution
        const fileInMongo = await File.find({ idInstitution: req.params.idInstitution });
        
        // Crear una nueva matriz de objetos con la información del usuario
        const fileInMongoWithUrl = await Promise.all(fileInMongo.map(async file => {
            // Encuentra el usuario correspondiente por idUser
            const user = await User.findById(file.idUser);
            
            return {
                ...file._doc,
                username: user ? user.name : 'Unknown',
            };
        }));

        res.json(fileInMongoWithUrl);
    } catch (err) {
        console.error('Error al obtener archivos:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const {idInst, idUser} = req.body;
        const fileReceived = req.files.file;
        console.log("entre")
        console.log(idInst)
        console.log(idUser)
        if (!fileReceived) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        const transformSize = fileReceived.size / (1024 * 1024);
        const roundedTransformSize = transformSize.toFixed(2);
        const extension = fileReceived.name.split('.').pop();
        const newFile = new File(
        {
            name:fileReceived.name,
            type: extension,
            size: roundedTransformSize,
            idInstitution: idInst,
            idUser: idUser,
            url: ""
        });
        newFile.url = "https://danielcs-node-aws.s3.amazonaws.com/" + idInst + "-" + newFile._id + "." + extension;
        const result = await uploadFileWithID(fileReceived, idInst, newFile._id, extension);
        await newFile.save();
        res.status(201).json(newFile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


router.put('/:id', async (req, res) => {
    try {
        await File.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json({ message: 'File updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/', async (req, res) => {
    try {
        await File.deleteMany();
        res.status(200).json({ message: 'All Files deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:idInst/:idFile/:ext', async (req, res) => {
    const fileName = `${req.params.idInst}-${req.params.idFile}.${req.params.ext}`;
    try {
        console.log(`Attempting to delete file: ${fileName}`);
        
        // Elimina el archivo de S3
        const s3Response = await deleteFile(fileName);
        console.log('S3 delete response:', s3Response);
        
        // Elimina el archivo de MongoDB
        const mongoResponse = await File.findByIdAndDelete(req.params.idFile);
        console.log('Mongo delete response:', mongoResponse);
        
        if (mongoResponse) {
            res.status(200).json({ message: 'File deleted in S3 and Mongo' });
        } else {
            res.status(404).json({ message: 'File not found in Mongo' });
        }
    } catch (err) {
        console.error('Error during file deletion:', err);
        res.status(500).json({ message: err.message });
    }
});





export default router