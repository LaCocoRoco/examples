import config from 'config';
import passport from 'passport';
import passportGithub, { StrategyOptions } from 'passport-github';
import { UserEntity } from '../typeorm/entitiy/user';
import { connect } from '../typeorm/database';

/**
 * Github Application Registration
 * Link: https://github.com/settings/developers
 */
const githubStrategyOptions: StrategyOptions = {
  clientID: config.get('authenticate.github.clientID'),
  clientSecret: config.get('authenticate.github.clientSecret'),
  callbackURL: config.get('authenticate.github.callbackURL'),
};

passport.use(new passportGithub.Strategy(githubStrategyOptions,
  async function (accessToken, refreshToken, profile, done) {
    try {
      // connect to database and query user
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');
      const userQuery = await repository.createQueryBuilder('user')
        .where('user.githubId = :githubId', { githubId: profile.id })
        .getOne();

      if (userQuery) {
        // return user
        const user = { name: userQuery.name, id: userQuery.id };
        return done(null, user);
      } else {
        // new user entity
        const userEntity = new UserEntity();
        userEntity.name = profile.displayName;
        userEntity.githubId = profile.id;

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
