import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { User, Edit } from 'lucide-react-native';
import { auth, db } from '../../FirebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isHousekeeperVisible, setIsHousekeeperVisible] = useState(false);
  const [isHouseholdVisible, setIsHouseholdVisible] = useState(false);
  const [isProfileVisibleToHouseholds, setIsProfileVisibleToHouseholds] = useState(false);
  const [isProfileVisibleToHousekeepers, setIsProfileVisibleToHousekeepers] = useState(false);

  const isHousekeeper = userData?.role === 'housekeeper' || userData?.role === 'housekeeper and household';
  const isHousehold = userData?.role === 'household' || userData?.role === 'housekeeper and household';

  const fetchUserData = useCallback(() => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData(data);
          setIsProfileVisibleToHouseholds(data?.profileVisibleToHouseholds || false);
          setIsProfileVisibleToHousekeepers(data?.profileVisibleToHousekeepers || false);
        }
      });
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = fetchUserData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchUserData]);

  const toggleProfileVisibilityToHouseholds = async () => {
    const newValue = !isProfileVisibleToHouseholds;
    setIsProfileVisibleToHouseholds(newValue);
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileVisibleToHouseholds: newValue
      });
    }
  };

  const toggleProfileVisibilityToHousekeepers = async () => {
    const newValue = !isProfileVisibleToHousekeepers;
    setIsProfileVisibleToHousekeepers(newValue);
    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileVisibleToHousekeepers: newValue
      });
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <User size={80} color="#F7EDE1" />
          </TouchableOpacity>
          <View style={styles.nameAndEdit}>
            <Text style={styles.nameText}>{userData.displayName || `${userData.firstName} ${userData.lastName}`}</Text>
            <TouchableOpacity
              style={styles.editButtonSmall}
              onPress={() => router.push('../editprofile')}
            >
              <Edit size={20} color="#F7EDE1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bio:</Text>
            <Text style={styles.infoValue}>{userData.bio || 'No bio yet'}</Text>
          </View>
        </View>

        {isHousekeeper && (
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>Make my profile visible to households</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#F7EDE1" }}
              thumbColor={isProfileVisibleToHouseholds ? "#f4f3f4" : "#f4f3f4"}
              onValueChange={toggleProfileVisibilityToHouseholds}
              value={isProfileVisibleToHouseholds}
            />
          </View>
        )}

        {isHousehold && (
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>Make my profile visible to housekeepers</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#F7EDE1" }}
              thumbColor={isProfileVisibleToHousekeepers ? "#f4f3f4" : "#f4f3f4"}
              onValueChange={toggleProfileVisibilityToHousekeepers}
              value={isProfileVisibleToHousekeepers}
            />
          </View>
        )}

        <View style={styles.roleSections}>
          {isHousekeeper && userData.housekeeperDetails && (
            <>
              <TouchableOpacity
                style={styles.roleHeader}
                onPress={() => setIsHousekeeperVisible(!isHousekeeperVisible)}
              >
                <Text style={styles.roleTitle}>Housekeeper Details</Text>
                <Text style={styles.toggleIcon}>{isHousekeeperVisible ? '▼' : '►'}</Text>
              </TouchableOpacity>

              {isHousekeeperVisible && (
                <View style={styles.roleDetails}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rate:</Text>
                    <Text style={styles.infoValue}>{userData.housekeeperDetails.rate}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Services:</Text>
                    <Text style={styles.infoValue}>
                      {userData.housekeeperDetails.servicesOffered?.join(', ')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {isHousehold && userData.householdDetails && (
            <>
              <TouchableOpacity
                style={styles.roleHeader}
                onPress={() => setIsHouseholdVisible(!isHouseholdVisible)}
              >
                <Text style={styles.roleTitle}>Household Details</Text>
                <Text style={styles.toggleIcon}>{isHouseholdVisible ? '▼' : '►'}</Text>
              </TouchableOpacity>

              {isHouseholdVisible && (
                <View style={styles.roleDetails}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>{userData.householdDetails.address}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rate:</Text>
                    <Text style={styles.infoValue}>{userData.householdDetails.offeredRate}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Services Needed:</Text>
                    <Text style={styles.infoValue}>
                      {userData.householdDetails.servicesNeeded?.join(', ')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => auth.signOut()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020D19',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1E2D3D',
  },
  nameAndEdit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editButtonSmall: {
    padding: 5,
  },
  infoSection: {
    backgroundColor: '#1E2D3D',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#F7EDE1',
    width: 100,
    fontSize: 16,
  },
  infoValue: {
    color: 'white',
    flex: 1,
    fontSize: 16,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2D3D',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  roleSections: {
    marginBottom: 20,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E2D3D',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  roleTitle: {
    color: '#F7EDE1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleIcon: {
    color: '#F7EDE1',
    fontSize: 18,
  },
  roleDetails: {
    backgroundColor: '#2A3A4D',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  logoutButtonContainer: {
    padding: 20,
    backgroundColor: '#020D19',
  },
  logoutButton: {
    backgroundColor: '#F7EDE1',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#020D19',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;