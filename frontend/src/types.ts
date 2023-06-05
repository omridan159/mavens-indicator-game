export enum GameState {
   Waiting,
   Indicator,
   Result
}

export enum ResultType {
   Success,
   TooSoon,
   WrongKey,
   TooLate
}

export interface Result {
   type: ResultType;
   message: string;
}

export interface IUser {
   username: string;
   gender: string;
   email: string;
   steps: number;
}
