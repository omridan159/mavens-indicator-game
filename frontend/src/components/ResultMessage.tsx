import styles from '../Pages/GamePage/GamePage.module.css';
import { Result, ResultType } from '../types';

function ResultMessage({ result }: { result: Result | null }) {
   if (!result) return null;

   const messageClass = result.type === ResultType.Success ? styles.success : styles.error;

   return <div className={`${styles.resultMessage} ${messageClass}`}>{result.message}</div>;
}

export default ResultMessage;
