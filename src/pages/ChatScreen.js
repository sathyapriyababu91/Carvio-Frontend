import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import { getToken, getUserId } from '../utils/authStorage';
import { styles } from '../styles/ChatScreen.styles';

const API = 'https://carvio-backend.onrender.com';

// Alert.alert does nothing on react-native-web, so use window.alert there.
const notify = (title, msg) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${msg}`);
  } else {
    Alert.alert(title, msg);
  }
};

export default function ChatScreen({ car, sellerId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);

  const listRef = useRef(null);
  const carId = car?._id || car?.id;
  console.log('CHAT SCREEN PROPS:', { carId, sellerId, carKeys: Object.keys(car || {}) });

  // Keep the latest onBack in a ref so a new function from the parent
  // does not re-trigger the message loading effect.
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  const vehicleName =
    car?.title ||
    `${car?.brand || ''} ${car?.modelName || ''}`.trim() ||
    'Vehicle';

  const vehiclePrice =
    car?.price != null
      ? `₹${Number(car.price).toLocaleString('en-IN')}`
      : '';

  const vehicleLocation = car?.location?.city || car?.city || '';

  // Get the logged-in user's ID.
  useEffect(() => {
    let active = true;

    const loadUserId = async () => {
      try {
        const id = await getUserId();

        if (active) {
          setUserId(id ? String(id) : null);
        }
      } catch (error) {
        console.log('GET USER ID ERROR:', error);
      }
    };

    loadUserId();

    return () => {
      active = false;
    };
  }, []);

  // Load messages from the backend.
  // The backend marks the messages sent to this user as read on every load.
  const loadMessages = useCallback(
    async (showError = false) => {
      if (!carId || !sellerId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();

        if (!token) {
          setLoading(false);
          notify('Login required', 'Please login to view messages.');
          onBackRef.current?.();
          return;
        }

        const response = await fetch(`${API}/chat/${carId}/${sellerId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || 'Unable to load messages');
        }

        const receivedMessages = Array.isArray(data.messages)
          ? data.messages
          : [];

        setMessages(receivedMessages);
      } catch (error) {
        console.log('LOAD MESSAGES ERROR:', error);

        if (showError) {
          notify('Messages', error.message || 'Could not load conversation.');
        }
      } finally {
        setLoading(false);
      }
    },
    [carId, sellerId]
  );

  // Initial load, then poll every 3 seconds for messages from the other user.
  useEffect(() => {
    let active = true;
    let requestInProgress = false;

    const refreshMessages = async (showError = false) => {
      if (requestInProgress || !active) return;

      requestInProgress = true;

      try {
        await loadMessages(showError);
      } finally {
        requestInProgress = false;
      }
    };

    setLoading(true);
    setMessages([]);

    refreshMessages(true);

    const intervalId = setInterval(() => {
      refreshMessages(false);
    }, 3000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [loadMessages]);

  // Send a message.
  const sendMessage = async () => {
    const text = message.trim();

    if (!text || sending) return;

    if (!carId || !sellerId) {
      notify('Error', 'Vehicle or receiver details are missing.');
      return;
    }

    try {
      setSending(true);

      const token = await getToken();

      if (!token) {
        notify('Login required', 'Please login to send messages.');
        return;
      }

      const response = await fetch(`${API}/chat/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          receiverId: sellerId,
          message: text,
        }),
      });

      const data = await response.json();

      console.log('SEND STATUS:', response.status, data);

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to send message');
      }

      if (data.data?._id) {
        setMessages((previous) => {
          const exists = previous.some(
            (item) => String(item._id) === String(data.data._id)
          );

          if (exists) return previous;

          return [...previous, data.data];
        });
      } else {
        await loadMessages(true);
      }

      setMessage('');

      setTimeout(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      }, 200);
    } catch (error) {
      console.log('SEND MESSAGE ERROR:', error);

      notify('Message not sent', error.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Display each message.
  const renderMessage = ({ item }) => {
    const text = item.message || '';

    const senderId = String(item.sender?._id || item.sender || '');

    const isMine = Boolean(userId) && senderId === String(userId);

    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <View style={[styles.messageRow, isMine && styles.myMessageRow]}>
        <View style={[styles.messageBubble, isMine && styles.myMessageBubble]}>
          <Text style={[styles.messageText, isMine && styles.myMessageText]}>
            {text}
          </Text>

          <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F6FED" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {vehicleName}
          </Text>
          <Text style={styles.headerSubtitle}>CARVIO Conversation</Text>
        </View>
      </View>

      <View style={styles.vehicleCard}>
        <View style={styles.vehicleImagePlaceholder}>
          <Text style={styles.vehicleIcon}>🚘</Text>
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle} numberOfLines={2}>
            {vehicleName}
          </Text>

          {!!vehiclePrice && (
            <Text style={styles.vehiclePrice}>{vehiclePrice}</Text>
          )}

          {!!vehicleLocation && (
            <Text style={styles.vehicleLocation}>📍 {vehicleLocation}</Text>
          )}
        </View>
      </View>

      <View style={styles.chatArea}>
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={messages}
          keyExtractor={(item, index) => String(item._id || item.id || index)}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messagesContent,
            { flexGrow: 1, paddingHorizontal: 15, paddingVertical: 12 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>Start a conversation</Text>
              <Text style={styles.emptyText}>
                Send a message to discuss this vehicle with the other user.
              </Text>
            </View>
          }
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd?.({ animated: true });
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor="#8A94A6"
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!sending}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!message.trim() || sending}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}