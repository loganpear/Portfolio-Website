
import { getGoogleDoc } from '../lib/google-docs';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  try {
    const docId = process.env.RESUME_DOC_ID;
    if (!docId) {
      return res.status(500).json({ error: 'RESUME_DOC_ID environment variable is not set' });
    }
    const data = await getGoogleDoc(docId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
