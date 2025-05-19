import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../../FirebaseConfig';
import { Search } from 'lucide-react-native';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string | null;
}

interface Chat {
  id: string;
  lastMessage: string;
  lastUpdated?: any; 
  unread?: { [userId: string]: boolean };
  users: string[];
}

interface ChatItem extends Chat {
  otherUser: User;
}

const Messages = () => {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
    'RobotoSlab-Regular': require('@/assets/fonts/RobotoSlab-Regular.ttf'),
  });
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 
  const currentUserId = auth.currentUser?.uid;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("users", "array-contains", currentUserId),
      orderBy("lastUpdated", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        const fetchedChats: ChatItem[] = [];
        const promises = querySnapshot.docs.map(async (docSnapshot) => {
          const chatData = docSnapshot.data() as Chat;
          const otherUserId = chatData.users.find((id: string) => id !== currentUserId);

          if (otherUserId) {
            try {
              const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
              if (otherUserDoc.exists()) {
                const userData = otherUserDoc.data();
                
                fetchedChats.push({
                  id: docSnapshot.id,
                  ...chatData,
                  lastUpdated: chatData.lastUpdated?.toDate?.() || null,
                  otherUser: {
                    id: otherUserId,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL || null,
                  },
                });
              }
            } catch (error) {
              console.error("Error fetching other user data:", error);
            }
          }
        });
        
        await Promise.all(promises);
        
        fetchedChats.sort((a, b) => {
          if (!a.lastUpdated) return 1;
          if (!b.lastUpdated) return -1;
          return b.lastUpdated - a.lastUpdated;
        });
        
        setChats(fetchedChats);
      } catch (error) {
        console.error("Error processing chat data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    return chats.filter(chat => {
      const userName = chat.otherUser.displayName || 
                      `${chat.otherUser.firstName || ''} ${chat.otherUser.lastName || ''}`.trim();
      
      return userName.toLowerCase().includes(normalizedQuery);
    });
  }, [chats, searchQuery]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F7EDE1" />
      </View>
    );
  }

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    const userName = item.otherUser.displayName || 
                    `${item.otherUser.firstName || ''} ${item.otherUser.lastName || ''}`.trim();
    
    return (
      <TouchableOpacity
        style={[
          styles.chatContainer,
          item.unread?.[currentUserId || ''] && styles.unreadChatContainer
        ]}
        onPress={() => router.push(`/messages/${item.otherUser.id}`)}
      >
        <Image
          source={item.otherUser.photoURL ? { uri: item.otherUser.photoURL } : require('@/assets/images/default-profile.png')}
          style={styles.profileImage}
        />

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[
              styles.chatName,
              item.unread?.[currentUserId || ''] && styles.unreadChatName
            ]}>
              {userName}
            </Text>
            <Text style={[
              styles.timeText,
              item.unread?.[currentUserId || ''] && styles.unreadTimeText
            ]}>
              {item.lastUpdated?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) || ''}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              item.unread?.[currentUserId || ''] && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerStyle: { backgroundColor: '#020D19' },
          headerTintColor: 'white',
        }}
      />

      <View style={styles.searchContainer}>
        <Search
          color={'gray'}
          size={24}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Messages"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.title}>Recent Chats</Text>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching chats found' : 'No chats yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try a different search term'
                : 'Start a conversation with a housekeeper or household'
              }
            </Text>
          </View>
        }
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EDE1',
    marginHorizontal: 20,
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#020D19',
    fontFamily: 'RobotoSlab-Regular',
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
  clearButtonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'RobotoSlab-Medium',
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EDE1',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  unreadChatContainer: {
    backgroundColor: '#F0E6D2',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 18,
    fontFamily: 'RobotoSlab-Medium',
    color: '#020D19',
  },
  unreadChatName: {
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'RobotoSlab-Regular',
    color: '#666',
  },
  unreadMessage: {
    color: '#020D19',
    fontFamily: 'RobotoSlab-Medium',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'RobotoSlab-Regular',
    color: '#999',
  },
  unreadTimeText: {
    color: '#020D19',
    fontFamily: 'RobotoSlab-Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'RobotoSlab-Regular',
    textAlign: 'center',
  },
});

export default Messages;