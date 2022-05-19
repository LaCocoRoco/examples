import { Router } from 'express';
import passport from 'passport';

const login = Router();

login.get('/', passport.authenticate('google', { scope: ['profile'] }));

export default login;
