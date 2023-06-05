import styles from '../Pages/GamePage/GamePage.module.css';

function UsersLeaderBoard({ usersLeaderBoard }: { usersLeaderBoard?: { username: string; steps: number }[] }) {
   if (!usersLeaderBoard) return null;

   const sortedUsers = usersLeaderBoard.sort((a, b) => b.steps - a.steps);

   return (
      <ul className={styles.leaderboard}>
         {sortedUsers.map((user, index) => (
            <li key={index}>
               {user.username}: {user.steps} steps
            </li>
         ))}
      </ul>
   );
}

export default UsersLeaderBoard;
