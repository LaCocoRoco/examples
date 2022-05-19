import nextConnect from 'next-connect';
import passport from 'lib/passport/github';

const github = nextConnect();

/**
 * next link component routing error because of passport redirect
 * lint rule @next/next/no-html-link-for-pages disabled to use link html anchor element
 */
github.use(passport.initialize()).get(passport.authenticate('github', { scope: ['profile'] }));

export default github;
