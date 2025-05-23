import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const servicesList = ['Cleaning', 'Odd Jobs', 'Errands', 'Gardening', 'Pool Cleaning'];

const HouseholdForm = () => {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
    'RobotoSlab-Regular': require('@/assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Bold': require('@/assets/fonts/RobotoSlab-Bold.ttf'),
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [offeredRate, setOfferedRate] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const nextForm = params.nextForm as string | undefined;

  const pickAndUploadImage = async () => {
    // Ask permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Permission to access media is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('upload_preset', 'Tabangi'); // replace with your preset

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dgdzmrhc4/image/upload', // replace with your cloud name
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setImageUrl(response.data.secure_url); // Save uploaded image URL
        Alert.alert('Upload Successful', 'Image uploaded.');
      } catch (error) {
        console.error(error);
        Alert.alert('Upload Failed', 'Could not upload image.');
      }
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    if (!address || selectedServices.length === 0 || !offeredRate) {
      Alert.alert('Error', 'Please fill all fields and select at least one service');
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("No user logged in");
      }

      const userDocRef = doc(db, "users", auth.currentUser.uid);

      await updateDoc(userDocRef, {
        householdDetails: {
          address,
          servicesNeeded: selectedServices,
          offeredRate: `₱${offeredRate}`,
          image: imageUrl,
          updatedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });

      if (nextForm) {
        router.push(`/${nextForm}`);
      } else {
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error("Error saving household details:", error);
      Alert.alert("Error", "Failed to save details. Please try again.");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#020D19' },
          headerTintColor: 'white',
        }}
      />

      <View style={{ flex: 1, backgroundColor: '#020D19', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/images/TNK_logo.png')} style={styles.imageStyle} />
        <View style={styles.formcont}>
          <Text style={styles.formhead}>Household Details</Text>

          <Text style={styles.formtxt}>Please enter your address</Text>
          <TextInput
            placeholder="Address"
            style={styles.inputcont}
            value={address}
            onChangeText={setAddress}
          />

          <View style={styles.row}>
            <View style={styles.servicesSection}>
              <Text style={styles.servicestxt}>Services Needed:</Text>
              {servicesList.map(service => (
                <TouchableOpacity
                  key={service}
                  style={styles.checkboxContainer}
                  onPress={() => toggleService(service)}
                >
                  <View style={[styles.checkbox, selectedServices.includes(service) && styles.checked]}>
                    {selectedServices.includes(service) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>{service}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.uploadContainer}>
              <Text style={styles.uploadLabel}>Household</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={pickAndUploadImage}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                ) : (
                  <Text style={styles.uploadIcon}>⬆</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.formtxt}>Please enter your offered rate</Text>
          <TextInput
            placeholder="Rate (₱)"
            style={styles.inputcont}
            value={offeredRate}
            onChangeText={setOfferedRate}
            keyboardType="numeric"
          />

          <View style={styles.submitcont}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.submittxt}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formcont: {
    paddingBottom: 10,
    backgroundColor: '#F7EDE1',
    width: '80%',
    borderRadius: 20,
    height: '75%',
    alignItems: 'center',
    paddingTop: 20,
  },
  imageStyle: {
    width: '160%',
    height: '30%',
    marginBottom: -10,
    marginTop: '-20%'
  },
  formhead: {
    color: 'black',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Bold',
    marginBottom: '10%',
    marginTop: '12%',
  },
  formtxt: {
    color: 'black',
    fontSize: 11,
    fontFamily: 'RobotoSlab-Regular',
    marginBottom: 2,
  },
  inputcont: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    padding: 10,
    width: '80%',
    marginBottom: '5%',
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 11,
  },
  servicesSection: {
    width: '65%',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: '5%',
  },
  servicestxt: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#D9D9D9',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'RobotoSlab-Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  uploadContainer: {
    alignItems: 'center',
    marginLeft: 20,
    width: '30%',
  },
  uploadLabel: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: 5,
    marginTop: '40%'
  },
  uploadBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 20,
    color: '#000',
  },
  submitcont: {
    backgroundColor: '#020D19',
    borderRadius: 20,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: '20%',
    alignSelf: 'flex-end',
    marginRight: '10%',
  },
  submittxt: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'RobotoSlab-Bold',
  }
});

export default HouseholdForm;