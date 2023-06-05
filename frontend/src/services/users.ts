import { IUser } from '../types';
import { api } from '../utils/api';

export async function createUser({ username }: { username: string }) {
   return (
      await api.post('/users', {
         body: JSON.stringify({ username })
      })
   ).data;
}

export async function updateUserSteps({ steps, username }: { username: string; steps: number }) {
   return (
      await api.patch(`/users/steps/${username}`, {
         body: JSON.stringify({ steps })
      })
   ).data;
}

export async function getUsersLeaderBoard() {
   return (await api.get('/users/leaderboard')).data as IUser[];
}
