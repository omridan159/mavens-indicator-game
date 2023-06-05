import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StartPage.module.css';
import { useCreateUser } from '../../queries/users';

function StartPage() {
   const [username, setUsername] = useState('');
   const [isLoading, setIsLoading] = useState(false); // New loading state
   const navigate = useNavigate();
   const { mutateAsync: createUser } = useCreateUser();

   const startGame = async () => {
      if (username.trim() !== '') {
         setIsLoading(true); // Set loading state to true

         try {
            await createUser({ username });
            navigate(`/game/${username}`);
         } catch (error) {
            alert('An error occurred while creating the user');
         } finally {
            setIsLoading(false); // Set loading state to false
         }
      } else {
         alert('Please enter a username');
      }
   };

   return (
      <div className={styles.startPage}>
         <label htmlFor="username" className={styles.label}>
            Enter your username:
         </label>
         <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="Username"
         />
         <p>Please enter your username and click START to begin the game.</p>
         <button onClick={startGame} className={styles.startButton} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'START'}
         </button>
      </div>
   );
}

export default StartPage;
