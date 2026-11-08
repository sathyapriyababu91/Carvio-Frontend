import { StyleSheet, Platform } from 'react-native';

const NAVY = '#12224F';
const BLUE = '#2F6FED';
const BG = '#F4F6FB';
const TEXT = '#101B36';
const MUTED = '#667085';
const BORDER = '#E3E8F2';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // ---------- Header ----------
  header: {
    backgroundColor: NAVY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 32,
    marginTop: -2,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#C9D6FF',
    fontSize: 12.5,
    marginTop: 2,
  },

  // ---------- Vehicle strip ----------
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },

  vehicleImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
  },

  vehicleImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  vehicleIcon: {
    fontSize: 26,
  },

  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  vehicleTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '700',
  },

  vehiclePrice: {
    color: BLUE,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },

  vehicleLocation: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },

  // ---------- Connection banner ----------
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 10,
  },

  offlineText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },

  // ---------- Messages ----------
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },

  dayWrap: {
    alignItems: 'center',
    marginVertical: 12,
  },

  dayPill: {
    backgroundColor: '#E6EBF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  dayText: {
    color: '#5B6577',
    fontSize: 11.5,
    fontWeight: '600',
  },

  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 3,
  },

  myMessageRow: {
    justifyContent: 'flex-end',
  },

  messageColumn: {
    maxWidth: '80%',
  },

  messageBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },

  myMessageBubble: {
    backgroundColor: BLUE,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },

  pendingBubble: {
    opacity: 0.7,
  },

  failedBubble: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  messageText: {
    color: TEXT,
    fontSize: 15.5,
    lineHeight: 21,
  },

  myMessageText: {
    color: '#FFFFFF',
  },

  failedText: {
    color: TEXT,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 3,
  },

  messageTime: {
    color: '#8A94A6',
    fontSize: 10.5,
  },

  myMessageTime: {
    color: '#D6E2FF',
  },

  failedTime: {
    color: '#8A94A6',
  },

  tick: {
    color: '#D6E2FF',
    fontSize: 11,
    marginLeft: 4,
  },

  tickRead: {
    color: '#9BF6C8',
  },

  failedLabel: {
    color: '#D92D20',
    fontSize: 11.5,
    marginTop: 3,
    alignSelf: 'flex-end',
  },

  // ---------- Input ----------
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  messageInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: '#F1F4F9',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    color: TEXT,
    fontSize: 15.5,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  sendButtonDisabled: {
    backgroundColor: '#B8C7EE',
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // ---------- Loading / empty ----------
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
  },

  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    color: MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },

  quickWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 18,
  },

  quickChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9D8FB',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
  },

  quickChipText: {
    color: BLUE,
    fontSize: 13.5,
    fontWeight: '600',
  },
});