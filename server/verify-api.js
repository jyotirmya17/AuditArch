const baseUrl = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('🚀 Starting AuditArch API Verification...');
    
    try {
        // 1. Signup
        const signupEmail = `verify_${Date.now()}@auditarch.com`;
        console.log(`\n1. Testing Signup [${signupEmail}]...`);
        const signupRes = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: signupEmail,
                password: 'password123',
                profile: {
                    firmName: 'Verification Firm Ltd',
                    designation: 'Chartered Accountants',
                    addressLine1: 'Audit House, Sector 5',
                    bankAccountHolderName: 'Verification Firm Ltd',
                    accountNumber: '9876543210',
                    bankName: 'Test Central Bank',
                    ifscCode: 'TCBN0001234',
                    billPrefix: 'VFL'
                }
            })
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) throw new Error(`Signup Failed: ${JSON.stringify(signupData)}`);
        
        console.log('✅ Signup Success:', signupData.success);
        console.log('📦 User Token:', signupData.token ? 'Received' : 'MISSING');

        const token = signupData.token;

        // 2. Get Me
        console.log('\n2. Testing /auth/me (Protected)...');
        const meRes = await fetch(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const meData = await meRes.json();
        if (!meRes.ok) throw new Error(`GetMe Failed: ${JSON.stringify(meData)}`);
        
        console.log('✅ Auth Success:', meData.success);
        console.log('🏢 Firm Name:', meData.data.profile.firmName);

        // 3. Create Client
        console.log('\n3. Testing Client Creation...');
        const clientRes = await fetch(`${baseUrl}/clients`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Delta Dynamics Corp',
                addressLine1: 'Building 7, Tech Park',
                city: 'Jaipur'
            })
        });
        const clientData = await clientRes.json();
        if (!clientRes.ok) throw new Error(`Client Create Failed: ${JSON.stringify(clientData)}`);
        
        console.log('✅ Client Created:', clientData.data.name);

        console.log('\n✨ ALL SUITE TESTS PASSED SUCCESSFULLY');
        
    } catch (err) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', err.message);
    }
};

runTests();
