import nextConnect from 'next-connect';
import passport from 'lib/passport/facebook';

const facebook = nextConnect();

/**
 * next link component routing error because of passport redirect
 * lint rule @next/next/no-html-link-for-pages disabled to use link html anchor element
 */
facebook.use(passport.initialize()).get(passport.authenticate('facebook'));

export default facebook;