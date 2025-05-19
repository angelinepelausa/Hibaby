import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { User } from 'lucide-react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

const VisitProfile = () => {
    const { userId } = useLocalSearchParams();
    const [userData, setUserData] = useState<any>(null);
    const [isHousekeeperVisible, setIsHousekeeperVisible] = useState(false);
    const [isHouseholdVisible, setIsHouseholdVisible] = useState(false);

    const isHousekeeper = userData?.role === 'housekeeper' || userData?.role === 'housekeeper and household';
    const isHousehold = userData?.role === 'household' || userData?.role === 'housekeeper and household';

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const userDoc = await getDoc(doc(db, "users", userId as string));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [userId]);

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
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

            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImageContainer}>
                            {(
                                (isHousehold && userData.householdDetails?.image) ? (
                                    <Image
                                        source={{ uri: userData.householdDetails.image }}
                                        style={styles.profileImage}
                                    />
                                ) : (isHousekeeper && userData.housekeeperDetails?.image) ? (
                                    <Image
                                        source={{ uri: userData.housekeeperDetails.image }}
                                        style={styles.profileImage}
                                    />
                                ) : userData.profileImageUrl ? (
                                    <Image
                                        source={{ uri: userData.profileImageUrl }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <User size={80} color="#F7EDE1" />
                                )
                            )}
                        </View>
                        <Text style={styles.nameText}>
                            {userData.displayName || `${userData.firstName} ${userData.lastName}`}
                        </Text>
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

                    {isHousekeeper && userData.housekeeperDetails && (
                        <View style={styles.roleSection}>
                            <View style={styles.roleHeader}>
                                <Text style={styles.roleTitle}>Housekeeper Details</Text>
                            </View>

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
                        </View>
                    )}

                    {isHousehold && userData.householdDetails && (
                        <View style={styles.roleSection}>
                            <View style={styles.roleHeader}>
                                <Text style={styles.roleTitle}>Household Details</Text>
                            </View>

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
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
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
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    nameText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
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
    roleSection: {
        marginBottom: 20,
    },
    roleHeader: {
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
    roleDetails: {
        backgroundColor: '#2A3A4D',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
});

export default VisitProfile;