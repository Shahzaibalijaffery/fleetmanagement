import { Pressable, View } from 'react-native';

import { AppText, Card } from '@/shared/components';
import { useThemedStyles } from '@/shared/hooks/useThemedStyles';
import type { AccentTone } from '@/shared/theme';

import { createStyles } from './QuickActions.styles';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export interface QuickActionSection {
  id: string;
  title: string;
  actions: QuickActionItem[];
}

interface QuickActionsProps {
  sections: QuickActionSection[];
}

function getSectionTone(sectionId: string): AccentTone {
  switch (sectionId) {
    case 'marketplace':
      return 'accent';
    case 'account':
      return 'success';
    default:
      return 'primary';
  }
}

interface QuickActionRowProps {
  action: QuickActionItem;
  showDivider: boolean;
}

function QuickActionRow({ action, showDivider }: QuickActionRowProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={action.title}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={styles.rowContent}>
        <AppText variant="body">{action.title}</AppText>
        {action.subtitle ? (
          <AppText variant="caption" color="textSecondary" numberOfLines={1}>
            {action.subtitle}
          </AppText>
        ) : null}
      </View>
      <AppText variant="body" color="primary" style={styles.chevron}>
        ›
      </AppText>
    </Pressable>
  );
}

export function QuickActions({ sections }: QuickActionsProps) {
  const styles = useThemedStyles(createStyles);

  if (sections.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppText variant="label" color="primary">
        Quick actions
      </AppText>

      {sections.map((section) => (
        <Card
          key={section.id}
          padding="md"
          accentTone={getSectionTone(section.id)}
          style={styles.sectionCard}
        >
          <View style={styles.sectionHeader}>
            <AppText
              variant="caption"
              color={getSectionTone(section.id)}
              style={styles.sectionLabel}
            >
              {section.title.toUpperCase()}
            </AppText>
          </View>

          {section.actions.map((action, index) => (
            <QuickActionRow
              key={action.id}
              action={action}
              showDivider={index < section.actions.length - 1}
            />
          ))}
        </Card>
      ))}
    </View>
  );
}
