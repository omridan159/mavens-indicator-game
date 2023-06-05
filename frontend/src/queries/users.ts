import { useMutation, useQuery } from 'react-query';
import { createUser, getUsersLeaderBoard, updateUserSteps } from '../services/users';
import { SimpleQueryKey } from './keys';

export const useCreateUser = () => {
   return useMutation(createUser);
};

export const useUpdateUserSteps = () => {
   return useMutation(updateUserSteps);
};

export const useGetUsersLeaderBoard = () => {
   return useQuery({
      queryKey: SimpleQueryKey.getUsersLeaderBoard,
      queryFn: () => getUsersLeaderBoard()
   });
};
