import config from 'config';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import nextConnect from 'next-connect';
import { serialize } from 'cookie';
import { Request, Response } from 'express';

const facebook = nextConnect();

facebook.get(passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
  function (req: Request, res: Response) {
    const token = jwt.sign({ user: req.user }, config.get('authenticate.jwt.secret'));
    // set token cookie and redirect
    res.setHeader('Set-Cookie', serialize('token', token, { path: '/' })).redirect('/');
  }
);

export default facebook;
