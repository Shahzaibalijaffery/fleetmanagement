import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

function sanitizeFilename(filename: string): string {
  const trimmed = filename.trim();

  if (trimmed.toLowerCase().endsWith('.csv')) {
    return trimmed.replace(/[^a-zA-Z0-9._-]/g, '-');
  }

  return `${trimmed.replace(/[^a-zA-Z0-9._-]/g, '-')}.csv`;
}

export async function shareCsvFile(filename: string, csvContent: string): Promise<void> {
  const safeFilename = sanitizeFilename(filename);
  const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${safeFilename}`;
  const fileContent = `\uFEFF${csvContent}`;

  await ReactNativeBlobUtil.fs.writeFile(filePath, fileContent, 'utf8');

  const fileUrl = Platform.OS === 'android' ? `file://${filePath}` : filePath;

  await Share.open({
    title: safeFilename,
    url: fileUrl,
    type: 'text/csv',
    filename: safeFilename,
    failOnCancel: false,
  });
}
