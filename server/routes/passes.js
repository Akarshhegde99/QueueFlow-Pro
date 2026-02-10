const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/db');
const { authMiddleware, adminMiddleware } = require('../utils/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// In-memory store for generated approval codes (passId -> code)
const approvalCodes = new Map();

// Create Digital Pass
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { purpose, type } = req.body;
        const VALID_PURPOSES = ['Library', 'Food Court', 'Sports Complex', 'Main Gate', 'Auditorium', 'Hostel'];

        if (!VALID_PURPOSES.includes(purpose)) {
            return res.status(400).json({ message: 'Invalid destination category' });
        }

        const passes = readData('passes');
        const activePass = passes.find(p => p.userId === req.user.id && p.status === 'pending');
        if (activePass) {
            return res.status(400).json({ message: 'You already have an active pass. Please use it or wait for it to expire.' });
        }

        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 3 * 60 * 60 * 1000); // 3 hours validity

        const newPass = {
            id: `PASS-${Date.now()}`,
            userId: req.user.id,
            userName: req.user.name,
            purpose,
            type: type || 'standard',
            status: 'pending',
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
        };

        // Generate secure QR content
        const qrData = jwt.sign({ passId: newPass.id }, JWT_SECRET, { expiresIn: '3h' });
        newPass.qrCode = await QRCode.toDataURL(qrData);

        passes.push(newPass);
        writeData('passes', passes);

        res.status(201).json(newPass);
    } catch (error) {
        res.status(500).json({ message: 'Error creating pass' });
    }
});

// Get My Passes
router.get('/mine', authMiddleware, (req, res) => {
    const passes = readData('passes');
    const myPasses = passes.filter(p => p.userId === req.user.id);
    res.json(myPasses);
});

// Get All Passes (Admin)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    const passes = readData('passes');
    res.json(passes);
});

// Verify QR (Admin scans)
router.post('/verify', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { qrToken } = req.body;
        const decoded = jwt.verify(qrToken, JWT_SECRET);
        const passId = decoded.passId;

        const passes = readData('passes');
        const pass = passes.find(p => p.id === passId);

        if (!pass) {
            return res.status(404).json({ message: 'Pass not found' });
        }

        if (pass.status !== 'pending') {
            return res.status(400).json({ message: `Pass is already ${pass.status}` });
        }

        if (new Date() > new Date(pass.expiresAt)) {
            pass.status = 'expired';
            const allPasses = readData('passes');
            const pIdx = allPasses.findIndex(p => p.id === pass.id);
            if (pIdx !== -1) {
                allPasses[pIdx].status = 'expired';
                writeData('passes', allPasses);
            }
            return res.status(400).json({ message: 'This pass has expired (3-hour limit reached)' });
        }

        // Generate 4-digit approval code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        approvalCodes.set(passId, code);

        // Optional: Auto-expire code in 5 minutes
        setTimeout(() => approvalCodes.delete(passId), 5 * 60 * 1000);

        // Fetch student details
        const users = readData('users');
        const student = users.find(u => u.id === pass.userId);

        res.json({
            passId,
            userName: pass.userName,
            userEmail: student?.email || 'N/A',
            userRole: student?.role || 'user',
            purpose: pass.purpose,
            type: pass.type,
            createdAt: pass.createdAt,
            expiresAt: pass.expiresAt,
            approvalCode: code
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid QR Code' });
    }
});

// Approve Pass (Admin enters 4-digit code)
router.post('/approve', authMiddleware, adminMiddleware, (req, res) => {
    const { passId, code } = req.body;

    if (approvalCodes.get(passId) !== code) {
        return res.status(400).json({ message: 'Invalid or expired approval code' });
    }

    const passes = readData('passes');
    const passIndex = passes.findIndex(p => p.id === passId);

    if (passIndex === -1) {
        return res.status(404).json({ message: 'Pass not found' });
    }

    passes[passIndex].status = 'completed';
    passes[passIndex].completedAt = new Date().toISOString();
    writeData('passes', passes);

    // Remove the code
    approvalCodes.delete(passId);

    // Notify user via Socket.IO
    if (req.io) {
        req.io.to(passes[passIndex].userId).emit('passUpdate', passes[passIndex]);
    }

    res.json({ message: 'Pass approved successfully', pass: passes[passIndex] });
});

// Drop Pass (Cancel/Delete)
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const passId = req.params.id;
        const userId = req.user.id;

        const passes = readData('passes');
        const passIndex = passes.findIndex(p => String(p.id) === String(passId) && String(p.userId) === String(userId));

        if (passIndex === -1) {
            console.error(`Pass not found: ID=${passId}, User=${userId}`);
            return res.status(404).json({ message: 'Pass not found or unauthorized' });
        }

        if (passes[passIndex].status !== 'pending') {
            return res.status(400).json({ message: 'Only pending passes can be dropped' });
        }

        passes.splice(passIndex, 1);
        writeData('passes', passes);

        res.json({ message: 'Pass dropped successfully' });
    } catch (error) {
        console.error('Drop pass error:', error);
        res.status(500).json({ message: 'Error dropping pass: ' + error.message });
    }
});

module.exports = router;
