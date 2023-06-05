export const enum QueryKeyPrefix {
   getUsersLeaderBoard = 'getUsersLeaderBoard'
}

export const SimpleQueryKey = {
   getUsersLeaderBoard: [QueryKeyPrefix.getUsersLeaderBoard]
} as const;

export const QueryKeyFactory = {};
