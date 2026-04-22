const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const AuthService = require('./src/services/auth.service');
const connectDB   = require('./src/config/db');

const verifySignup = async () => {
    try {
        await connectDB();
        const email = `direct_test_${Date.now()}@auditarch.com`;
        const result = await AuthService.signup({
            email,
            password: 'password123',
            profile: {
                firmName: 'Direct Test Firm',
                designation: 'Chartered Accountants',
                addressLine1: '789 Node Way',
                bankAccountHolderName: 'Direct Test Firm',
                accountNumber: '1122334455',
                bankName: 'System Bank',
                ifscCode: 'SYST0001234',
                billPrefix: 'DIR'
            }
        });
        console.log('--- SIGNUP RESULT JSON ---');
        console.log(JSON.stringify({ success: true, ...result }, null, 2));
        console.log('--------------------------');
        mongoose.connection.close();
    } catch (err) {
        console.error('❌ DIRECT SIGNUP FAILED:', err.message);
        mongoose.connection.close();
    }
};

verifySignup();
