import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameIndicator from '../../components/GameIndicator';
import ResultMessage from '../../components/ResultMessage';
import UsersLeaderBoard from '../../components/UsersLeaderBoard';
import { ErrorMessages, SuccessMessage } from '../../consts';
import { SimpleQueryKey } from '../../queries/keys';
import { useGetUsersLeaderBoard, useUpdateUserSteps } from '../../queries/users';
import { GameState, Result, ResultType } from '../../types';
import { queryClient } from '../../utils/query-client';
import styles from './GamePage.module.css';

function GamePage() {
   const { username } = useParams();

   const [gameState, setGameState] = useState<GameState>(GameState.Waiting);
   const [result, setResult] = useState<Result | null>(null);
   const [indicatorSide, setIndicatorSide] = useState<'left' | 'right'>('left');

   const [steps, setSteps] = useState<number>(0);

   const { mutate: updateUserSteps } = useUpdateUserSteps();

   const { data: usersLeaderBoard, refetch: refetchLeaderBoard } = useGetUsersLeaderBoard();

   const handleResultState = () => {
      if (gameState === GameState.Result && result?.type === ResultType.Success) {
         setSteps((steps) => steps + 1);
         updateUserSteps(
            { username, steps: steps + 1 },
            {
               onSuccess: () => {
                  queryClient.invalidateQueries(SimpleQueryKey.getUsersLeaderBoard);
               },
               onError: (e) => {
                  alert('An error occurred while updating the user steps');
               }
            }
         );
      }
   };

   const handleWaitingState = () => {
      if (gameState !== GameState.Waiting) return;

      const timeout = Math.random() * 3000 + 2000;
      const timerId = setTimeout(() => {
         const side = Math.random() > 0.5 ? 'left' : 'right';
         setIndicatorSide(side);

         setGameState(GameState.Indicator);
      }, timeout);

      return () => clearTimeout(timerId);
   };

   const handleIndicatorState = () => {
      let indicatorShown = false;
      if (gameState === GameState.Indicator) {
         indicatorShown = true;
         const handleKeyPress = (event: KeyboardEvent) => {
            clearTimeout(tooLateTimeout);
            if ((event.key === 'a' && indicatorSide === 'left') || (event.key === 'l' && indicatorSide === 'right')) {
               if (!indicatorShown) {
                  setResult({ type: ResultType.TooSoon, message: ErrorMessages.TooSoon });
               } else {
                  setResult({ type: ResultType.Success, message: SuccessMessage });
               }
               setGameState(GameState.Result);
            } else {
               setResult({ type: ResultType.WrongKey, message: ErrorMessages.WrongKey });
               setGameState(GameState.Result);
            }
         };

         const tooLateTimeout = setTimeout(() => {
            setResult({ type: ResultType.TooLate, message: ErrorMessages.TooLate });
            setGameState(GameState.Result);
         }, 1000);

         window.addEventListener('keydown', handleKeyPress);

         return () => {
            window.removeEventListener('keydown', handleKeyPress);
            clearTimeout(tooLateTimeout);
         };
      } else {
         const handleKeyPress = (event: KeyboardEvent) => {
            setResult({ type: ResultType.TooSoon, message: ErrorMessages.TooSoon });
            setGameState(GameState.Result);
         };

         window.addEventListener('keydown', handleKeyPress);

         return () => {
            window.removeEventListener('keydown', handleKeyPress);
         };
      }
   };

   const resetResultState = () => {
      if (gameState === GameState.Result) {
         setTimeout(() => {
            setResult(null);
            setGameState(GameState.Waiting);
         }, 2000);
      }
   };

   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(handleResultState, [gameState, result, updateUserSteps, refetchLeaderBoard]);
   useEffect(handleWaitingState, [gameState]);
   useEffect(handleIndicatorState, [gameState, indicatorSide]);
   useEffect(resetResultState, [gameState]);

   return (
      <div className={styles.gamePage}>
         <GameIndicator gameState={gameState} indicatorSide={indicatorSide} />
         <ResultMessage result={result} />
         <UsersLeaderBoard usersLeaderBoard={usersLeaderBoard} />
         <button
            onClick={() => {
               refetchLeaderBoard();
            }}
            className={styles.fetchButton}
         >
            Fetch Leaderboard
         </button>
      </div>
   );
}

export default GamePage;
