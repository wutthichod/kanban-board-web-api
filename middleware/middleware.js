import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

export async function protect(req, res, next) {
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({
            where : {id : decoded.userId}
        });

        next();
    } catch (error) {
        console.log('Authentication Error: ', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
}

export default protect;