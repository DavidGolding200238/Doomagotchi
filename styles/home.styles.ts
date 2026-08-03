import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pet Card
  petCard: {
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    overflow: 'hidden',
    marginBottom: 22,
    position: 'relative',
  },
  vitalityBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 2,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
  },
  vitalityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  petImageWrap: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EB',
  },
  petImage: {
    width: 190,
    height: 190,
  },

  // Health / Happiness bars
  barsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  barBlock: {
    flex: 1,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
    letterSpacing: 0.4,
    flex: 1,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  barTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: '#f0e6e0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  demoToggle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },

  // Focus Analysis card
  focusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    marginBottom: 24,
  },
  focusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
    letterSpacing: 0.3,
  },
  focusValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  focusRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  statusPill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
  },
  limitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },

  // Power Ups
  powerList: {
    gap: 10,
    marginBottom: 24,
  },
  powerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
  },
  powerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  powerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  powerMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginTop: 2,
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    gap: 6,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777',
    textAlign: 'center',
  },
});