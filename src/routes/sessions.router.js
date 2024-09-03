import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UsersDAO from '../dao/usersDAO.js';
import envs from '../config/envs.config.js';
import { body, validationResult } from 'express-validator';

export const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UsersDAO.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        delete user.password
        const token = jwt.sign({ user }, envs.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('UserCookie', token, { httpOnly: true });
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await UsersDAO.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = {
            email,
            password: hashedPassword
        };

        const createdUser = await UsersDAO.createUser(newUser);
        return res.status(201).json({ message: 'User registered successfully', user: createdUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put('/update', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { email, password } = req.body;
    const userId = req.user._id; // Obtén el ID del usuario de la solicitud autenticada

    try {
        const updateData = {};
        if (email) {
            updateData.email = email;
        }
        if (password) {
            updateData.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        }

        const updatedUser = await UsersDAO.updateUserById(userId, updateData);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('UserCookie');
    res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).json(req.user);
});
