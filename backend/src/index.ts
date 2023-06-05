import logger from 'jet-logger';
import './pre-start';

import server from './server';

const msg = 'Express server started on port: ' + ((process.env.PORT?.toString() as string) ?? '5051');
server.listen(process.env.PORT ?? 5051, () => logger.info(msg));
