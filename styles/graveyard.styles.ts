import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Shared
  safeRed: {
    flex: 1,
    backgroundColor: '#1A1210',
  },
  darkBg: {
    flex: 1,
    backgroundColor: '#1A1210',
  },

  // ========== LANDSCAPE ==========
  landscapeRow: {
    flex: 1,
    backgroundColor: '#1A1210',
    flexDirection: 'row',
    padding: 12,
    gap: 14,
  },
  landscapeScroll: {
    flex: 1,
  },
  landscapeScrollContent: {
    gap: 12,
    paddingBottom: 20,
  },
  landscapeRight: {
    width: '34%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  landscapeSkullBox: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#B83F3F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#F5E6D3',
    textAlign: 'center',
    lineHeight: 18,
  },
  landscapeSubtitle: {
    fontSize: 13,
    color: '#C9B8A8',
    textAlign: 'center',
    lineHeight: 18,
  },
  landscapeStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  landscapeStatLabel: {
    fontSize: 11,
    color: '#BBAEA0',
  },
  landscapeStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F5E6D3',
  },
  landscapeDivider: {
    width: 1,
    backgroundColor: '#3D2E2A',
  },

  // ========== PORTRAIT ==========
  portraitScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  portraitHeader: {
    alignItems: 'center',
    marginBottom: 22,
  },
  portraitSkullBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#B83F3F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  portraitTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 15,
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 6,
  },
  portraitSubtitle: {
    fontSize: 14,
    color: '#C9B8A8',
    textAlign: 'center',
    lineHeight: 20,
  },
  portraitStatsBar: {
    flexDirection: 'row',
    backgroundColor: '#2A1F1C',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3D2E2A',
    marginBottom: 20,
    overflow: 'hidden',
  },
  portraitStatCell: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  portraitStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BBAEA0',
  },
  portraitStatValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F5E6D3',
    marginTop: 2,
  },
  portraitStatsDivider: {
    width: 1,
    backgroundColor: '#3D2E2A',
  },
  cardsList: {
    gap: 12,
    marginBottom: 18,
  },

  // Pet card
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#2A1F1C',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3D2E2A',
    padding: 12,
    alignItems: 'center',
    gap: 14,
  },
  petAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1A1210',
    borderWidth: 2.5,
    borderColor: '#5A4038',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  petName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: '#E8D5C4',
  },
  petDays: {
    fontSize: 13,
    color: '#C9B8A8',
    marginTop: 4,
  },
  causePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#3D1F1C',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  causeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E07A6A',
  },
  petDate: {
    fontSize: 12,
    color: '#BBAEA0',
    marginTop: 6,
  },

  // Reserved plot
  reservedPlot: {
    borderWidth: 1.5,
    borderColor: '#B83F3F',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: '#2A1F1C',
    marginBottom: 16,
  },
  reservedText: {
    fontSize: 13,
    color: '#E07A6A',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 19,
  },

  // Lesson
  lessonCard: {
    backgroundColor: '#2A1F1C',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#3D2E2A',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E8D5C4',
  },
  lessonBody: {
    fontSize: 13,
    color: '#C9B8A8',
    lineHeight: 19,
    marginBottom: 8,
  },
  lessonLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E07A6A',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#F5E6D3',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 14,
    color: '#C9B8A8',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#2A1F1C',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2.5,
    borderColor: '#5A4038',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalPetWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalShadow: {
    width: 64,
    height: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.55)',
    marginTop: -5,
  },
  modalName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalDays: {
    fontSize: 13,
    color: '#C9B8A8',
    marginBottom: 12,
  },
  modalCausePill: {
    backgroundColor: '#3D1F1C',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 9,
    marginBottom: 16,
  },
  modalCauseText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E07A6A',
  },
  modalEpitaphWrap: {
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#3D2E2A',
    paddingVertical: 14,
    width: '100%',
    marginBottom: 14,
  },
  modalEpitaph: {
    fontSize: 14,
    color: '#E8D5C4',
    textAlign: 'center',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  modalDate: {
    fontSize: 13,
    color: '#BBAEA0',
    marginBottom: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#B83F3F',
    paddingHorizontal: 26,
    paddingVertical: 11,
    borderRadius: 12,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

    modalCloseBtnCircle: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#B83F3F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});