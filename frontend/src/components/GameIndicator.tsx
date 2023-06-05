import styles from '../Pages/GamePage/GamePage.module.css';
import { GameState } from '../types';

function GameIndicator({ gameState, indicatorSide }) {
   if (gameState !== GameState.Indicator) return null;

   return <div className={`${styles.indicator} ${styles[indicatorSide]}`}>Indicator</div>;
}

export default GameIndicator;
