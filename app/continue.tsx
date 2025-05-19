import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const Continue = () => {
    const [fontsLoaded] = useFonts({
        'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
        'RobotoSlab-Regular': require('@/assets/fonts/RobotoSlab-Regular.ttf'),
        'RobotoSlab-Bold': require('@/assets/fonts/RobotoSlab-Bold.ttf'),
    });

    const router = useRouter();

    const handleRoleSelection = async (role: string) => {
        if (!auth.currentUser) {
            console.error("No user logged in");
            return;
        }

        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userDocRef, {
                role: role,
                updatedAt: serverTimestamp()
            }, { merge: true });

            if (role === 'household') {
                router.push('/householdform');
            } else if (role === 'housekeeper') {
                router.push('/housekeeperform');
            } else {
                router.push({
                    pathname: '/householdform',
                    params: { nextForm: 'housekeeperform' }
                });
            }
        } catch (error) {
            console.error("Error updating role:", error);
            Alert.alert("Error", "Failed to update role. Please try again.");
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Continue',
                    headerStyle: { backgroundColor: '#020D19' },
                    headerTintColor: 'white',
                }}
            />

            <View style={{ flex: 1, backgroundColor: '#020D19', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('@/assets/images/TNK_logo.png')} style={styles.imageStyle} />
                <View style={styles.continuecontainer}>
                    <Text style={styles.continuetext}>
                        CONTINUE AS
                    </Text>

                    <View style={styles.btncontainer}>
                        <View style={styles.contbtn}>
                            <TouchableOpacity onPress={() => handleRoleSelection('household')}>
                                <Text style={styles.conttxt}>
                                    Household
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contbtn}>
                            <TouchableOpacity onPress={() => handleRoleSelection('housekeeper')}>
                                <Text style={styles.conttxt}>
                                    Housekeeper
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contbtn}>
                            <TouchableOpacity onPress={() => handleRoleSelection('housekeeper and household')}>
                                <Text style={styles.conttxt}>
                                    Both
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    continuecontainer: {
        backgroundColor: '#F7EDE1',
        height: '42%',
        width: '80%',
        borderRadius: 20,
        padding: 20,
        paddingTop: '3%',
    },
    imageStyle: {
        width: '160%',
        height: '30%',
        marginBottom: -10,
        marginTop: '-40%'
    },
    continuetext: {
        marginTop: '15%',
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Bold',
        marginBottom: '10%'
    },
    btncontainer: {
        alignItems: 'center',
    },
    contbtn: {
        backgroundColor: '#D9D9D9',
        borderRadius: 30,
        padding: 15,
        width: '60%',
        marginBottom: '5%',
    },
    conttxt: {
        color: 'black',
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Regular',
    }
});

export default Continue;