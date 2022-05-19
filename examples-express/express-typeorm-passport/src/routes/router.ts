import { Router } from 'express';

import googleLogin from './api/authenticate/login/google';
import googleRedirect from './api/authenticate/redirect/google';
import facebookLogin from './api/authenticate/login/facebook';
import facebookRedirect from './api/authenticate/redirect/facebook';
import githubLogin from './api/authenticate/login/github';
import githubRedirect from './api/authenticate/redirect/github';

export const router = Router();

router.use('/api/authenticate/login/google', googleLogin);
router.use('/api/authenticate/login/facebook', facebookLogin);
router.use('/api/authenticate/login/github', githubLogin);

router.use('/api/authenticate/redirect/google', googleRedirect);
router.use('/api/authenticate/redirect/facebook', facebookRedirect);
router.use('/api/authenticate/redirect/github', githubRedirect);
