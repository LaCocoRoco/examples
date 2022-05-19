import { Router } from 'express';
import passport from 'passport';

const login = Router();

login.get('/', passport.authenticate('github', { scope: ['profile'] }));

export default login;
