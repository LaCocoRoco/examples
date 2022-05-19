import nextConnect from 'next-connect';
import passport from 'lib/passport/google';

const google = nextConnect();

/**
 * next link component routing error because of passport redirect
 * lint rule @next/next/no-html-link-for-pages disabled to use link html anchor element
 */
google.use(passport.initialize()).get(passport.authenticate('google', { scope: ['profile'] }));

export default google;
