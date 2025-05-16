import { generateAccessToken } from './token.js';

export const generateTokenAndSetCookie = (res, payload) => {
    const isProduction = process.env.NODE_ENV === 'production'

    const token = generateAccessToken(payload)

    res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        // sameSite: 'None',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return token;

}