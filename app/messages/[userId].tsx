import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { collection, doc, getDoc, setDoc, serverTimestamp, onSnapshot, query, orderBy, addDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../FirebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;
}

const MessageScreen = () => {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
    'RobotoSlab-Regular': require('@/assets/fonts/RobotoSlab-Regular.ttf'),
  });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const currentUserId = auth.currentUser?.uid;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId || !userId) {
      setLoading(false);
      return;
    }

    const getChatId = (userId1: string, userId2: string) => {
      return [userId1, userId2].sort().join('_');
    };

    const chatId = getChatId(currentUserId, userId as string);

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId as string));
        if (userDoc.exists()) {
          setOtherUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const setupChat = async () => {
      try {
        const chatDocRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatDocRef);

        if (!chatDoc.exists()) {
          await setDoc(chatDocRef, {
            users: [currentUserId, userId],
            lastMessage: "",
            lastUpdated: serverTimestamp(),
            [`unread.${currentUserId}`]: false,
            [`unread.${userId}`]: true, 
          });
        } else {
          await updateDoc(chatDocRef, {
            [`unread.${currentUserId}`]: false,
          });
        }

        const messagesRef = collection(db, "chats", chatId, "messages");
        const messagesQuery = query(
          messagesRef,
          orderBy("timestamp", "asc")
        );

        const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
          const msgs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          }));
          setMessages(msgs);
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        });
        return unsubscribeMessages;
      } catch (error) {
        console.error("Error setting up chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    const unsubscribePromise = setupChat();

    return () => {
      unsubscribePromise.then((unsub) => {
        if (unsub) {
          unsub();
        }
      });
    };
  }, [currentUserId, userId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUserId || !userId) return;

    try {
      const chatId = [currentUserId, userId].sort().join('_');
      const chatDocRef = doc(db, "chats", chatId);

      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        text: message,
        senderId: currentUserId,
        timestamp: serverTimestamp()
      });

      await updateDoc(chatDocRef, {
        lastMessage: message,
        lastUpdated: serverTimestamp(),
        [`unread.${userId}`]: true
      });

      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!fontsLoaded || !otherUser || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7EDE1" />
      </View>
    );
  }

  const renderMessage = ({ item }: { item: any }) => {
    const isCurrentUser = item.senderId === currentUserId;

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>
          {item.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#020D19' },
          headerTintColor: 'white',
          headerLeft: () => (
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Image
                source={otherUser?.photoURL ? { uri: otherUser.photoURL } : require('@/assets/images/default-profile.png')}
                style={styles.profileImage}
              />
              <Text style={styles.headerText}>
                {otherUser?.firstName} {otherUser?.lastName}
              </Text>
            </View>
          ),
        }}
      />

      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <MaterialIcons
            name="send"
            size={24}
            color={message.trim() ? '#020D19' : '#999'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020D19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#020D19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
    marginRight: 12,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'RobotoSlab-Medium',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F7EDE1',
    borderBottomRightRadius: 2,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A3A4D',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'RobotoSlab-Regular',
    lineHeight: 22,
  },
  currentUserText: {
    color: '#020D19',
  },
  otherUserText: {
    color: 'white',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E2D3D',
    borderTopWidth: 1,
    borderTopColor: '#2A3A4D',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7EDE1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 16,
    marginRight: 10,
    color: '#020D19',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7EDE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default MessageScreen;