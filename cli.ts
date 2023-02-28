/* supports a simple CLI to start server and select provider */
import { serve } from '$std/http/server.ts'

import { startServer } from "./server.ts";


await startServer(serve)