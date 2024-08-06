import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const {name, image} = req.body;
    const newCategory = new Category({name, image});
    try {
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        await Category.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json({ message: 'Category updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/', async (req, res) => {
    try {
        await Category.deleteMany();
        res.status(200).json({ message: 'All Categorys deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

export default router