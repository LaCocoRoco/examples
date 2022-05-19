import { Router } from 'express';
import passport from 'passport';

const login = Router();

login.get('/', passport.authenticate('facebook'));

export default login;
