import express from 'express'
import { createServer } from 'http'

const app = express()

export const findAvailablePort = async (startPort: number): Promise<number> => {
  let port = startPort;
  while (port < 65535) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          server.close();
          resolve(port);
        });
        server.on('error', reject);
      });
      return port;
    } catch {
      port++;
    }
  }
  throw new Error('No available ports');
};

const PORT = process.env.PORT || await findAvailablePort(3001); 