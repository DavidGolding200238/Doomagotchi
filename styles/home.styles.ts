import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Shared
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF9F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== LANDSCAPE ==========
  landscapeSafe: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  landscapeRow: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    gap: 14,
  },
  landscapePetCard: {
    width: '38%',
    backgroundColor: '#FFF0EB',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  landscapePetCircle: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: '#FFF7F2',
    borderWidth: 3,
    borderColor: '#E8B923',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapePetName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
    marginTop: 16,
  },
  landscapeWhiteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    overflow: 'hidden',
  },
  landscapeScrollContent: {
    padding: 18,
    paddingBottom: 24,
  },
  landscapeHeaderRow: {
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },

  // ========== PORTRAIT ==========
  portraitSafe: {
    flex: 1,
    backgroundColor: '#B83F3F',
  },
  portraitHero: {
    paddingTop: 8,
    paddingBottom: 28,
    alignItems: 'center',
    backgroundColor: '#FFF0EB',
  },
  portraitHeaderRow: {
    width: '100%',
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 18,
  },
  portraitPetCircle: {
    width: 232,
    height: 232,
    borderRadius: 116,
    backgroundColor: '#FFF7F2',
    borderWidth: 3.5,
    borderColor: '#FFC300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitPetName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 17,
    color: '#1a1a1a',
    marginTop: 18,
  },
  portraitWhiteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -22,
    borderWidth: 1.5,
    borderColor: '#d4c8be',
    overflow: 'hidden',
  },
  portraitScrollContent: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 40,
  },

  // ========== SHARED UI ==========
  barsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 26,
  },
  barsRowLandscape: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  barBlock: {
    flex: 1,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  barLabelRowLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
  },
  barLabelLandscape: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
  },
  barValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  barValueLandscape: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionTitleLandscape: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 10,
  },

  focusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 17,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 28,
  },
  focusCardLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 22,
  },
  focusLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777',
  },
  focusLabelLandscape: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777',
  },
  focusValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1a1a1a',
    marginTop: 2,
  },
  focusValueLandscape: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1a1a1a',
  },
  focusRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  focusRightLandscape: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusPillLandscape: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  statusText: {
    fontWeight: '800',
    fontSize: 12,
  },
  statusTextLandscape: {
    fontWeight: '800',
    fontSize: 11,
  },
  limitText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  limitTextLandscape: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
  },

  // Challenges
  powerList: {
    gap: 11,
    marginBottom: 28,
  },
  powerListLandscape: {
    gap: 9,
    marginBottom: 22,
  },
  powerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#FFF7F2',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
  },
  powerCardCompleted: {
    backgroundColor: '#FFFBF5',
    borderColor: '#E8D5A3',
    borderWidth: 1.5,
  },
  powerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  powerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerIconNeutral: {
    backgroundColor: '#F0ECE8',
    borderWidth: 1,
    borderColor: '#E4DDD6',
  },
  powerTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  powerMeta: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#999',
    marginTop: 2,
  },
  powerChevron: {
    color: '#C4B5A8',
    fontSize: 18,
  },
  powerChevronCompleted: {
    color: '#C4A35A',
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: 11,
  },
  badgesRowLandscape: {
    flexDirection: 'row',
    gap: 9,
  },
  badgeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 22,
    backgroundColor: '#FFF7F2',
    borderWidth: 1.5,
    borderColor: '#F0E6E0',
    gap: 8,
    minHeight: 96,
    justifyContent: 'center',
  },
  badgeCardLandscape: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: '#FFF7F2',
    borderWidth: 1.5,
    borderColor: '#F0E6E0',
    gap: 7,
    minHeight: 88,
    justifyContent: 'center',
  },
  badgeCardUnlocked: {
    backgroundColor: '#FFFBF0',
    borderColor: '#E8D5A3',
    borderWidth: 1.5,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
  },
  badgeNameLandscape: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
  },
  badgeBackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A4A3A',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 4,
  },
  badgeBackTextLandscape: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#5A4A3A',
    textAlign: 'center',
    lineHeight: 13,
    paddingHorizontal: 2,
  },
  badgeBackLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C4A35A',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  // Expand / collapse
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B83F3F',
  },

  // Permission banner
  permissionBanner: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  permissionTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: '#1a1a1a',
  },
  permissionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Lay to rest
  layToRestButton: {
    marginTop: 10,
    backgroundColor: '#B83F3F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'center',
  },
  layToRestText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },

  // Header menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menuCard: {
    position: 'absolute',
    top: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    minWidth: 180,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  menuItemTextDanger: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B83F3F',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0e6e0',
    marginHorizontal: 12,
  },

  // Challenge detail modal
  challengeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  challengeModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    padding: 24,
    alignItems: 'center',
  },
  challengeModalIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#F0ECE8',
    borderWidth: 1,
    borderColor: '#E4DDD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  challengeModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 6,
  },
  challengeModalStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
  },
  challengeModalDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  challengeModalMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  challengeModalMetaPill: {
    backgroundColor: '#FFF7F2',
    borderWidth: 1,
    borderColor: '#f0e6e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  challengeModalMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  challengeModalClose: {
    backgroundColor: '#B83F3F',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  challengeModalCloseText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});