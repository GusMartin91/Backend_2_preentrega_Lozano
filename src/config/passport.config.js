import passport from "passport";
import passportJWT from "passport-jwt";
import envs from "./envs.config.js";
import UsersDAO from "../dao/usersDAO.js";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const buscarToken = (req) => {
    let token = null;

    if (req.cookies.UserCookie) {
        token = req.cookies.UserCookie;
    }

    return token;
};

export const iniciarPassport = () => {
    passport.use(
        "jwt",
        new JwtStrategy(
            {
                secretOrKey: envs.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromExtractors([buscarToken])
            },
            async (payload, done) => {
                try {
                    console.log(payload.user);
                    
                    const user = await UsersDAO.getUserById(payload.user._id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
};
