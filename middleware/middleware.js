import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import { UserRole } from '@prisma/client';

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

export async function authorize(req, res, next) {
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role != UserRole.ADMIN) {
            return res.status(403).json({
                success: false,
                message: user.role
            });
        }

        next();


    } catch (error) {
        console.log('Authorization Error: ', error);
        return res.status(403).json({
            success: false,
            message: 'Authorization failed'
        });
    }
}