import jwt from 'jsonwebtoken'

export const verifyAccessToken = (req, res, next) => {
    const token = req.cookies.accessToken
        // console.log("accessToken", token);

    if (!token) return res.status(401).json({ message: 'Access denied. Token missing' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}

