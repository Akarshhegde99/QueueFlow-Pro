const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = readData('users');

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Case-insensitive duplicate email check
        if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
            return res.status(400).json({ message: 'Email already registered. Please use another one or Sign In.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user', // strictly force all new signups to 'user' role
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeData('users', users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password and role selection are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = readData('users');

        // 1. Precise Identification
        const systemAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        const isSystemAdminEmail = normalizedEmail === systemAdminEmail;
        const systemAdminPassword = (process.env.ADMIN_PASSWORD || '').trim();

        // Determine account's true role
        let registeredRole = null;
        const dbUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (dbUser) {
            registeredRole = dbUser.role;
        } else if (isSystemAdminEmail) {
            registeredRole = 'admin';
        }

        console.log(`Login attempt for ${normalizedEmail} as ${role}. Account role: ${registeredRole}`);

        // Account doesn't exist
        if (!registeredRole) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // --- MANDATORY ROLE MATCH ---
        if (registeredRole.toLowerCase() !== role.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: `This account is registered as ${registeredRole}. Please select the ${registeredRole.toUpperCase()} role to sign in.`
            });
        }

        // 2. Authentication Logic
        let authenticatedUser = null;

        // DB match
        if (dbUser) {
            const isMatch = await bcrypt.compare(password, dbUser.password);
            if (isMatch) authenticatedUser = dbUser;
        }

        // Environmental override (fallback or for .env only admins)
        if (!authenticatedUser && isSystemAdminEmail && password === systemAdminPassword) {
            authenticatedUser = {
                id: 'system-admin',
                name: 'System Admin',
                email: normalizedEmail,
                role: 'admin'
            };
        }

        if (!authenticatedUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: authenticatedUser.id, role: authenticatedUser.role, name: authenticatedUser.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: authenticatedUser.id,
                name: authenticatedUser.name,
                email: authenticatedUser.email,
                role: authenticatedUser.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
