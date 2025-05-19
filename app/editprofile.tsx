import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editRate, setEditRate] = useState('');
  const [editHouseholdRate, setEditHouseholdRate] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editServicesOffered, setEditServicesOffered] = useState<string[]>([]);
  const [editServicesNeeded, setEditServicesNeeded] = useState<string[]>([]);

  const servicesList = ['Cleaning', 'Odd Jobs', 'Errands', 'Gardening', 'Pool Cleaning'];

  const isHousekeeper = userData?.role === 'housekeeper' || userData?.role === 'housekeeper and household';
  const isHousehold = userData?.role === 'household' || userData?.role === 'housekeeper and household';

  const fetchUserData = useCallback(async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setEditEmail(data.email);
        setEditPhone(data.phoneNumber);
        setEditBio(data.bio || '');
        
        if (data.housekeeperDetails) {
          setEditRate(data.housekeeperDetails.rate?.replace('₱', '') || '');
          setEditServicesOffered(data.housekeeperDetails.servicesOffered || []);
        }
        
        if (data.householdDetails) {
          setEditAddress(data.householdDetails.address || '');
          setEditServicesNeeded(data.householdDetails.servicesNeeded || []);
          setEditHouseholdRate(data.householdDetails.offeredRate?.replace('₱', '') || '');
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleService = (service: string, listType: 'offered' | 'needed') => {
    if (listType === 'offered') {
      setEditServicesOffered(prev =>
        prev.includes(service)
          ? prev.filter(s => s !== service)
          : [...prev, service]
      );
    } else {
      setEditServicesNeeded(prev =>
        prev.includes(service)
          ? prev.filter(s => s !== service)
          : [...prev, service]
      );
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    const updates: any = {
      email: editEmail,
      phoneNumber: editPhone,
      bio: editBio,
      updatedAt: new Date()
    };

    if (isHousekeeper) {
      updates.housekeeperDetails = {
        ...userData.housekeeperDetails,
        rate: `₱${editRate}`,
        servicesOffered: editServicesOffered
      };
    }

    if (isHousehold) {
      updates.householdDetails = {
        ...userData.householdDetails,
        address: editAddress,
        servicesNeeded: editServicesNeeded,
        offeredRate: `₱${editHouseholdRate}`
      };
    }

    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), updates);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#F7EDE1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="Email"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={editPhone}
            onChangeText={setEditPhone}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={editBio}
            onChangeText={setEditBio}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999"
            multiline
          />
        </View>

        {isHousekeeper && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Housekeeper Details</Text>
            
            <Text style={styles.label}>Rate (₱)</Text>
            <TextInput
              style={styles.input}
              value={editRate}
              onChangeText={setEditRate}
              placeholder="Rate"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Services Offered</Text>
            <View style={styles.servicesContainer}>
              {servicesList.map(service => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.serviceButton,
                    editServicesOffered.includes(service) && styles.selectedService
                  ]}
                  onPress={() => toggleService(service, 'offered')}
                >
                  <Text style={[
                    styles.serviceText,
                    editServicesOffered.includes(service) && styles.selectedServiceText
                  ]}>
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isHousehold && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Household Details</Text>
            
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={editAddress}
              onChangeText={setEditAddress}
              placeholder="Address"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Offered Rate (₱)</Text>
            <TextInput
              style={styles.input}
              value={editHouseholdRate}
              onChangeText={setEditHouseholdRate}
              placeholder="Offered Rate"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Services Needed</Text>
            <View style={styles.servicesContainer}>
              {servicesList.map(service => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.serviceButton,
                    editServicesNeeded.includes(service) && styles.selectedService
                  ]}
                  onPress={() => toggleService(service, 'needed')}
                >
                  <Text style={[
                    styles.serviceText,
                    editServicesNeeded.includes(service) && styles.selectedServiceText
                  ]}>
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Check size={20} color="#020D19" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020D19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#020D19',
  },
  headerTitle: {
    color: '#F7EDE1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  section: {
    backgroundColor: '#1E2D3D',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F7EDE1',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    color: '#F7EDE1',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2A3A4D',
    borderRadius: 10,
    padding: 12,
    color: 'white',
    marginBottom: 15,
    fontSize: 14,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  serviceButton: {
    backgroundColor: '#2A3A4D',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedService: {
    backgroundColor: '#F7EDE1',
  },
  serviceText: {
    color: 'white',
    fontSize: 12,
  },
  selectedServiceText: {
    color: '#020D19',
  },
  saveButtonContainer: {
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#F7EDE1',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#020D19',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EditProfile;