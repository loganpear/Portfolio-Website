
import { google } from 'googleapis';

/**
 * Server-side utility to fetch Google Docs content.
 * Note: This requires Node.js environment variables to be set.
 */
export async function getGoogleDoc(docId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });

    const docs = google.docs({ version: 'v1', auth });
    const res = await docs.documents.get({ documentId: docId });
    
    // Simple parser to extract text from the document structure
    let content = '';
    res.data.body?.content?.forEach(element => {
      if (element.paragraph) {
        element.paragraph.elements?.forEach(el => {
          if (el.textRun) content += el.textRun.content;
        });
      }
    });

    return {
      title: res.data.title,
      body: content
    };
  } catch (error) {
    console.error('Error fetching Google Doc:', error);
    throw error;
  }
}

export async function listFolderFiles(folderId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
      fields: 'files(id, name, createdTime, description)',
    });

    return res.data.files || [];
  } catch (error) {
    console.error('Error listing Drive folder:', error);
    throw error;
  }
}
