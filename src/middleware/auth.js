import jwt from "jsonwebtoken"
import envs from "../config/envs.config.js";

export const auth = (req, res, next) => {
    if (!req.cookies.CoderCookie) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Token not found.` })
    }

    let token = req.cookies.CoderCookie

    try {
        let usuario = jwt.verify(token, envs.JWT_SECRET)
        req.user = usuario
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `${error.message}` })
    }

    next()
}