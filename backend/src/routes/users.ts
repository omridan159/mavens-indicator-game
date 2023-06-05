import { Router } from 'express';
import { createUser, updateUserSteps, getLeaderboard } from '../services/users/users';

export const usersRouter = Router();

usersRouter.post('/', async (req, res, next) => {
   try {
      const newUser = await createUser(req.body.username);
      return res.json(newUser);
   } catch (error) {
      next(error);
   }
});

usersRouter.patch('/steps/:username', (req, res, next) => {
   try {
      const user = updateUserSteps(req.params.username, req.body.steps);

      if (!user) {
         return res.status(404).send('User Not Found');
      }
      return res.json(user);
   } catch (error) {
      next(error);
   }
});

usersRouter.get('/leaderboard', (req, res, next) => {
   try {
      const leaderboard = getLeaderboard();
      return res.json(leaderboard);
   } catch (error) {
      next(error);
   }
});
