import axios from 'axios';
import { IUser } from './types';

let users: IUser[] = [];

export async function createUser(username: string) {
   const genderResponse = await axios.get(`https://api.genderize.io/?name=${username}`);
   const gender = genderResponse.data.probability > 0.95 ? genderResponse.data.gender : 'undetermined';

   const randomUserResponse = await axios.get('https://randomuser.me/api/');
   const user = randomUserResponse.data.results[0];

   const newUser: IUser = {
      username,
      gender,
      email: user.email,
      steps: 0
   };

   users.push(newUser);

   return newUser;
}

export function updateUserSteps(username: string, steps: number) {
   const user = users.find((user) => user.username === username);
   if (user) {
      user.steps = steps;
      return user;
   }

   return null;
}

export function getLeaderboard(): IUser[] {
   users.sort((a, b) => b.steps - a.steps);
   return users;
}
