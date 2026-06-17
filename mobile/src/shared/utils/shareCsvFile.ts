import { Share } from 'react-native';

export async function shareCsvFile(filename: string, csvContent: string): Promise<void> {
  await Share.share(
    {
      title: filename,
      message: csvContent,
    },
    {
      subject: filename,
      dialogTitle: 'Export CSV',
    },
  );
}
