import { NextApiRequest, NextApiResponse } from 'next';
import { getSQL } from '../../utils/sql';

export interface LogMetadata {
  targetDisplayed: boolean; // Was the target image shown?
  decoys: string[]; // The decoy images shown
  hint: boolean; // Was a hint provided?
  timeElapsed: number; // Time between showing the challenge & completion
  incorrectGuesses: number; // Number of incorrect guesses
}

export interface Log {
  target: string;
  metadata: Partial<LogMetadata>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = JSON.parse(await req.body) as Log;

  const sql = getSQL();

  // Insert a new row:
  await sql`
        INSERT INTO logs ${sql(log, 'target', 'metadata')}
    `;

  res.status(200).json({ success: true });
}
