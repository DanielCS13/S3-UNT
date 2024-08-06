import express from 'express';
import Institution from '../models/Institution.js';
import {getFile, uploadImageInstituion } from '../s3.js';

const router = express.Router();

//router get institution
router.get('/get-all', async (req, res) => {
    try {
        const institutions = await Institution.find();
        res.json(institutions);
    } catch (err) {
        console.error('Error al obtener instituciones:', err.message);
        res.status(500).json({ message: err.message });
    }
});

//router get institution by id
router.get('/:id', async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        res.json(institution);
    } catch (err) {
        console.error('Error al obtener instituciones:', err.message);
        res.status(500).json({ message: err.message });
    }
});

//router get id by urlInstitution
router.get('/get-id/:urlInstitution', async (req, res) => {
    try {
        const institution = await Institution.findOne({urlInstitution: req.params.urlInstitution});
        res.json(institution);
    } catch (err) {
        console.error('Error al obtener instituciones:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const institutions = await Institution.find();

        // Prepara un array para almacenar la información de las instituciones junto con los detalles de las imágenes
        const result = [];

        for (const element of institutions) {
            try {
                // Obtén el archivo desde S3
                const file = await getFile("ID-INST-" + element._id);
                // console.log("file:", file)
                // Extrae solo la información necesaria del archivo
                const fileData = {
                    name: file.Metadata['x-amz-meta-name'] || 'Unknown',
                    size: file.ContentLength,
                    mimetype: file.ContentType,
                    url: "https://danielcs-node-aws.s3.amazonaws.com/ID-INST-" + element._id
                };

                // Agrega la información de la institución junto con los detalles de la imagen
                result.push({
                    ...element.toObject(),
                    fileData: fileData
                });
            } catch (fileError) {
                console.error('Error al obtener archivo:', fileError.message);
                result.push({
                    ...element.toObject(),
                    fileData: null,
                    error: fileError.message
                });
            }
        }

        res.json(result);
    } catch (err) {
        console.error('Error al obtener instituciones:', err.message);
        res.status(500).json({ message: err.message });
    }
});



router.post('/', async (req, res) => {
    const {name} = req.body;
    const file = req.files.file;
    console.log(req.files)

    if (!file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    try {
        const newInstitution = new Institution(
            {
                nameInstitution: name,
                urlInstitution: name.toLowerCase().replace(/ /g, '-'),
                image: file.name
            }
        );
        const idInstitution = await newInstitution.save();

        const fileImageInstituion  = await uploadImageInstituion(file, idInstitution._id);

        res.status(201).json(newInstitution);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        await Institution.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json({ message: 'Institution updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/', async (req, res) => {
    try {
        await Institution.deleteMany();
        res.status(200).json({ message: 'All Institutions deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Institution.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Institution deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

export default router