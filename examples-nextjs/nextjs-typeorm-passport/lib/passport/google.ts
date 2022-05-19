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
  async function (accessToken, refreshToken, profile, done) {
    try {
      // connect to database and query user
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');
      const userQuery = await repository.createQueryBuilder('user')
        .where('user.googleId = :googleId', { googleId: profile.id })
        .getOne();

      if (userQuery) {
        // return user
        const user = { name: userQuery.name, id: userQuery.id };
        return done(null, user);
      } else {
        // new user entity
        const userEntity = new UserEntity();
        userEntity.name = profile.displayName;
        userEntity.googleId = profile.id;

        // save new user to database
        const userDatabase = await repository.save(userEntity);
        const user = { name: userDatabase.name, id: userDatabase.id };

        // return user
        return done(null, user);
      }
    } catch (error) {
      return done(null, false);
    }
  },
));

export default passport;
