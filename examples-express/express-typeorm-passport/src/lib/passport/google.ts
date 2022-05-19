import config from 'config';
import passport from 'passport';
import passportGoogle, { IOAuth2StrategyOption } from 'passport-google-oauth';
import { UserEntity } from '../typeorm/entitiy/user';
import { connect } from '../typeorm/database';

/**
 * Google Application Registration
 * Link: https://console.developers.google.com/apis/credentials
 */
const googleStrategyOptions: IOAuth2StrategyOption = {
  clientID: config.get('authenticate.google.clientID'),
  clientSecret: config.get('authenticate.google.clientSecret'),
  callbackURL: config.get('authenticate.google.callbackURL'),
};

passport.use(new passportGoogle.OAuth2Strategy(googleStrategyOptions,
  async function (_accessToken, _refreshToken, profile, done) {
    try {
      // connect to database
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');

      // query user from database
      const databaseUser = await repository.createQueryBuilder('user')
        .where('user.googleId = :googleId', { googleId: profile.id })
        .getOne();

      if (databaseUser) {
        // return user
        const user = { name: databaseUser.name, id: databaseUser.id };
        return done(null, user);
      } else {
        // create new user
        const newUser = new UserEntity();
        newUser.name = profile.displayName;
        newUser.githubId = profile.id;

        // save new user to database
        const databaseUser = await repository.save(newUser);
        const user = { name: databaseUser.name, id: databaseUser.id };

        // return user
        return done(null, user);
      }
    } catch (error) {
      return done(error as Error);
    }
  },
));

export default passport;
