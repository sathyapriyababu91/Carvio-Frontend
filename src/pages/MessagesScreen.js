import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  getToken,
} from '../utils/authStorage';

export default function MessagesScreen({
  setActiveTab,
  openChat,
}) {

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load once, then refresh every 5 seconds so the unread count
  // always matches the server (it drops after a chat is read).
  useEffect(() => {
    if (!setActiveTab) return undefined;

    loadChats(false);

    const intervalId = setInterval(() => {
      loadChats(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const loadChats = async (silent = false) => {
    try {
      const token = await getToken();

      if (!token) {
        setActiveTab('LOGIN');
        return;
      }

      const response = await fetch(
      'https://carvio-backend.onrender.com/chat/my-chats',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (!silent) {
          Alert.alert(
            'Error',
            data.message || 'Unable to load messages'
          );
        }
        return;
      }

      setChats(data.chats || []);

    } catch (error) {
      console.log(
        'LOAD CHATS ERROR:',
        error
      );

      if (!silent) {
        Alert.alert(
          'Error',
          'Unable to connect to CARVIO server'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat) => {
    if (!chat?.car?._id || !chat?.user?._id) {
      return;
    }

    // Opening the chat means it is read: clear its unread badge right away.
    setChats((previous) =>
      previous.map((item) =>
        item.car?._id === chat.car._id && item.user?._id === chat.user._id
          ? { ...item, unreadCount: 0 }
          : item
      )
    );

    openChat({
      car: chat.car,
      sellerId: chat.user._id,
    });
  };

  const renderChat = ({ item }) => {

    const userName =
      item.user?.name || 'CARVIO User';

    const vehicleName =
      item.car?.title ||
      `${item.car?.brand || ''} ${item.car?.modelName || ''}`.trim() ||
      'Vehicle';

    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.chatItem, hasUnread && styles.chatItemUnread]}
        activeOpacity={0.8}
        onPress={() => handleChatPress(item)}
      >

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.chatContent}>

          <View style={styles.topRow}>

            <Text
              style={styles.userName}
              numberOfLines={1}
            >
              {userName}
            </Text>

            {item.lastMessageAt && (
              <Text style={[styles.time, hasUnread && styles.timeUnread]}>
                {new Date(
                  item.lastMessageAt
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}

          </View>

          <Text
            style={styles.vehicleName}
            numberOfLines={1}
          >
            {vehicleName}
          </Text>

          <View style={styles.messageRow}>

            <Text
              style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>

            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount}
                </Text>
              </View>
            )}

          </View>

        </View>

      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F6FED" />

        <Text style={styles.loadingText}>
          Loading messages...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Messages
        </Text>

        <Text style={styles.subtitle}>
          Your vehicle enquiries and conversations
        </Text>

      </View>

      {chats.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            💬
          </Text>

          <Text style={styles.emptyTitle}>
            No messages yet
          </Text>

          <Text style={styles.emptyText}>
            When someone contacts you about your vehicle,
            the conversation will appear here.
          </Text>

        </View>

      ) : (

        <FlatList
          data={chats}
          keyExtractor={(item, index) =>
            `${item.car?._id}_${item.user?._id}_${index}`
          }
          renderItem={renderChat}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

      )}

    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#101B36',
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#68738A',
  },

  list: {
    padding: 16,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E9F2',
    shadowColor: '#101B36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  chatItemUnread: {
    borderColor: '#BFD3FB',
    backgroundColor: '#F8FAFF',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F6FED',
  },

  chatContent: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#101B36',
    marginRight: 8,
  },

  time: {
    fontSize: 11,
    color: '#8A93A5',
  },

  timeUnread: {
    color: '#2F6FED',
    fontWeight: '700',
  },

  vehicleName: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '600',
    color: '#2F6FED',
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#68738A',
    marginRight: 8,
  },

  lastMessageUnread: {
    color: '#101B36',
    fontWeight: '700',
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2F6FED',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },

  loadingText: {
    marginTop: 10,
    color: '#68738A',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101B36',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#68738A',
  },
};