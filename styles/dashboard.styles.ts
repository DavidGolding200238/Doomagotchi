import { Colors, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.coral,
  },
  petNameHeader: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: Colors.light.text,
  },
  bellButton: {
    padding: 8,
  },

  // Pet Stage
  petStage: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vitalityBadge: {
    backgroundColor: Colors.light.coralLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  vitalityText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.coral,
    letterSpacing: 0.8,
  },
  circleFrame: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.light.coralSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.coral,
    shadowColor: Colors.light.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  petImage: {
    width: '85%',
    height: '85%',
  },

  // Bars
  barsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.lg,
  },
  barCard: {
    flex: 1,
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.coral,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#f0e6e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Focus Analysis
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 12,
  },
  focusCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    marginBottom: Spacing.lg,
  },
  focusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  focusTime: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.light.text,
  },
  focusLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  healthyBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  healthyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },

  // Power Ups
  powerUpList: {
    gap: 10,
    marginBottom: Spacing.lg,
  },
  powerUpItem: {
    backgroundColor: Colors.light.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  powerUpIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.light.coralLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  powerUpContent: {
    flex: 1,
  },
  powerUpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  powerUpReward: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  badgeItem: {
    alignItems: 'center',
    width: 70,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.light.white,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});