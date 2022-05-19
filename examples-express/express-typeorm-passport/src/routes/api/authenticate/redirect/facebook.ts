import config from 'config';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Router } from 'express';
import { Request, Response } from 'express';

const facebook = Router();

facebook.get('/', passport.authenticate('facebook', { session: false }),
  function (req: Request, res: Response) {
    if (req.user) {
      res.json({ token: jwt.sign({ user: req.user }, config.get('authenticate.jwt.secret')) });
    } else {
      res.status(404);
    }
  },
);

export default facebook;
