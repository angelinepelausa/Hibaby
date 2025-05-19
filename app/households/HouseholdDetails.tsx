import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const HouseholdDetails = () => {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
  });
  const [households, setHouseholds] = useState<any[]>([]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("profileVisibleToHousekeepers", "==", true),
          where("role", "in", ["household", "housekeeper and household"])
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          householdDetails: doc.data().householdDetails || {}
        }));
        setHouseholds(data);
      } catch (error) {
        console.error("Error fetching households:", error);
      }
    };

    fetchHouseholds();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={
            item.householdDetails?.image
              ? { uri: item.householdDetails.image }
              : require('@/assets/images/default-house.png')
          }
          style={styles.profileImage}
        />
        <View style={styles.cardDetails}>
          <Text style={styles.nameText}>Owner: {item.firstName} {item.lastName}</Text>

          <Text style={styles.sectionTitle}>Required:</Text>
          <View style={styles.servicesContainer}>
            {item.householdDetails?.servicesNeeded?.map((service: string, index: number) => (
              <View key={index} style={styles.servicePill}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{item.householdDetails?.address || 'Not specified'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rates:</Text>
            <Text style={styles.infoValue}>{item.householdDetails?.offeredRate || 'Not specified'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push(`/visitprofile`)}
        >
          <Text style={styles.buttonText}>View User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push(`/messages/${item.id}`)}
      >
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#020D19' },
          headerTintColor: 'white',
        }}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Households</Text>
          {households.length > 0 ? (
            <FlatList
              data={households}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <Text style={styles.noResultsText}>No households available at the moment</Text>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020D19',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 20,
  },
  noResultsText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'RobotoSlab-Medium',
  },
  card: {
    backgroundColor: '#F7EDE1',
    borderRadius: 11,
    marginBottom: 20,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
  },
  nameText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 5,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  servicePill: {
    backgroundColor: '#D9D9D9',
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
  },
  serviceText: {
    color: 'black',
    fontSize: 10,
    fontFamily: 'RobotoSlab-Medium',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    width: 60,
  },
  infoValue: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  profileButton: {
    backgroundColor: '#020D19',
    borderRadius: 20,
    padding: 10,
    width: '50%',
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#A25D67',
    borderRadius: 20,
    padding: 10,
    width: '35%',
  },
  messageButton: {
    backgroundColor: '#020D19',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'flex-end',
    width: '35%',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    textAlign: 'center',
  },
});

export default HouseholdDetails;