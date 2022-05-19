import config from 'config';
import passport from 'passport';
import passportFacebook, { StrategyOption } from 'passport-facebook';
import { UserEntity } from '../typeorm/entitiy/user';
import { connect } from '../typeorm/database';

/**
 * Facebook Application Registration
 * Link: https://developers.facebook.com/apps/
 */
const facebookStrategyOptions: StrategyOption = {
  clientID: config.get('authenticate.facebook.clientID'),
  clientSecret: config.get('authenticate.facebook.clientSecret'),
  callbackURL: config.get('authenticate.facebook.callbackURL'),
};

passport.use(new passportFacebook.Strategy(facebookStrategyOptions,
  async function (_accessToken, _refreshToken, profile, done) {
    try {
      // connect to database
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');

      // query user from database
      const databaseUser = await repository.createQueryBuilder('user')
        .where('user.facebookId = :facebookId', { facebookId: profile.id })
        .getOne();

      if (databaseUser) {
        // return user
        const user = { name: databaseUser.name, id: databaseUser.id };
        return done(null, user);
      } else {
        // create new user
        const newUser = new UserEntity();
        newUser.name = profile.displayName;
        newUser.facebookId = profile.id;

        // save new user to database
        const databaseUser = await repository.save(newUser);

        // return user
        const user = { name: databaseUser.name, id: databaseUser.id };
        return done(null, user);
      }
    } catch (error) {
      return done(error as Error);
    }
  },
));

export default passport;
