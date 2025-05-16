import bcrypt from 'bcryptjs';
import User from '../DB/models/users.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';

// === GET /api/auth/me ===
export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
}


// ✅ SIGNUP with OTP
export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully' });

    } catch (err) {
        console.error('SignUp Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// ✅ SIGN IN (only if verified)
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateTokenAndSetCookie(res, user)

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('SignIn Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
        })

        return res.json({ message: 'Logged out successfully' })
    } catch (err) {
        console.error('Logout Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
