import { env } from './env';

interface FirebaseServiceAccountJson {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

export interface FirebaseCredentials {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function fromServiceAccountJson(raw: string): FirebaseCredentials | null {
  try {
    const parsed = JSON.parse(raw) as FirebaseServiceAccountJson;

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      console.error('[firebase] FIREBASE_SERVICE_ACCOUNT_JSON is missing required fields');
      return null;
    }

    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key.replace(/\\n/g, '\n'),
    };
  } catch {
    console.error('[firebase] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
    return null;
  }
}

function fromSeparateEnvVars(): FirebaseCredentials | null {
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
}

export function getFirebaseCredentials(): FirebaseCredentials | null {
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return fromServiceAccountJson(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  return fromSeparateEnvVars();
}
