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
  async function (accessToken, refreshToken, profile, done) {
    try {
      // connect to database and query user
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');
      const userQuery = await repository.createQueryBuilder('user')
        .where('user.facebookId = :facebookId', { facebookId: profile.id })
        .getOne();

      if (userQuery) {
        // return user
        const user = { name: userQuery.name, id: userQuery.id };
        return done(null, user);
      } else {
        // new user entity
        const userEntity = new UserEntity();
        userEntity.name = profile.displayName;
        userEntity.facebookId = profile.id;

        // save new user to database
        const userDatabase = await repository.save(userEntity);

        // return user
        const user = { name: userDatabase.name, id: userDatabase.id };
        return done(null, user);
      }
    } catch (error) {
      return done(null, false);
    }
  },
));

export default passport;
