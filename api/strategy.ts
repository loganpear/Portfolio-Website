
import { listFolderFiles } from '../lib/google-docs';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  try {
    const folderId = process.env.STRATEGY_FOLDER_ID?.trim();
    if (!folderId) {
      return res.status(500).json({ error: 'STRATEGY_FOLDER_ID environment variable is not set' });
    }
    const files = await listFolderFiles(folderId);
    res.status(200).json(files);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
