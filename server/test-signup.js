const testSignup = async () => {
    const email = `fixed_audit_${Date.now()}@arch.com`;
    console.log(`Testing Signup for ${email}...`);
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password: 'password123',
                profile: {
                    firmName: 'Fixed Audit Firm',
                    designation: 'Chartered Accountants',
                    addressLine1: '456 Correct Way',
                    bankAccountHolderName: 'Fixed Audit Firm',
                    accountNumber: '9988776655',
                    bankName: 'Arch Bank',
                    ifscCode: 'ARCH0123456',
                    billPrefix: 'FAC'
                }
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Signup Success:', data.success);
            console.log('✅ Token Received:', !!data.token);
        } else {
            console.error('❌ Signup Failed:', data);
        }
    } catch (err) {
        console.error('❌ Request Error:', err.message);
    }
};

testSignup();
