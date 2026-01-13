
import { google } from 'googleapis';

/**
 * Server-side utility to fetch Google Docs content.
 * Handles both individual environment variables and the full JSON string.
 */
function getAuth(scopes: string[]) {
  let credentials: any;

  // 1. Try to parse the full JSON if provided
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } catch (e) {
      console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS as JSON');
    }
  }

  // 2. Fallback to individual variables if JSON parse failed or wasn't provided
  if (!credentials) {
    credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    };
  }

  // 3. Ensure the private key is formatted correctly for Google's SDK
  // It handles the case where newlines are escaped as "\\n" string literals
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Missing Google Service Account credentials. Check your environment variables.');
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes,
  });
}

export async function getGoogleDoc(docId: string) {
  try {
    const auth = getAuth(['https://www.googleapis.com/auth/documents.readonly']);
    const docs = google.docs({ version: 'v1', auth });
    
    const res = await docs.documents.get({ documentId: docId });
    
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
  } catch (error: any) {
    console.error(`Error fetching Google Doc (${docId}):`, error.message);
    throw error;
  }
}

export async function listFolderFiles(folderId: string) {
  try {
    const auth = getAuth(['https://www.googleapis.com/auth/drive.readonly']);
    const drive = google.drive({ version: 'v3', auth });
    
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
      fields: 'files(id, name, createdTime, description)',
    });

    return res.data.files || [];
  } catch (error: any) {
    console.error(`Error listing Drive folder (${folderId}):`, error.message);
    throw error;
  }
}
