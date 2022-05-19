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
  async function (_accessToken, _refreshToken, profile, done) {
    try {
      // connect to database
      const connection = await connect();
      const repository = connection.getRepository<UserEntity>('UserEntity');

      // query user from database
      const databaseUser = await repository.createQueryBuilder('user')
        .where('user.githubId = :githubId', { githubId: profile.id })
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