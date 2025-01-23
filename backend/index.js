import config from './utils/config.js'
import logger from './utils/logger.js'

import app from './app.js'

app.listen(config.PORT, () => {
  logger.info(`🚀 Server running on PORT ${config.PORT}`)
})
