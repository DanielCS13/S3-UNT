import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const {name, email, role, idInstitution, password} = req.body;
    console.log(req.body)
    const newUser = new User({name, email, role, idInstitution, password, state: 'Activo'});
    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/', async (req, res) => {
    try {
        await User.deleteMany();
        res.status(200).json({ message: 'All users deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

export default router