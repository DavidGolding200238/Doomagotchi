import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#B83F3F',
  },
  keyboard: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B83F3F',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 18,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    borderRadius: 14,
    marginBottom: 18,
  },
  passwordRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#f0e6e0',
    borderRadius: 14,
    marginBottom: 28,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
  },
  showHideBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  showHideText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B83F3F',
  },
  signupBtn: {
    backgroundColor: '#B83F3F',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  signupBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  loginRow: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#777',
  },
  loginLink: {
    color: '#B83F3F',
    fontWeight: '700',
  },
});