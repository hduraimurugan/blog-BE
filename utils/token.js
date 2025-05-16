import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id || user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d'
  })
}

