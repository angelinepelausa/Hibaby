import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const signUp = async () => {
        if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const userData = {
                uid: user.uid,
                email: email,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
                displayName: `${firstName.trim()} ${lastName.trim()}`,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'active'
            };

            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, userData);
            
            console.log("Firestore write successful for user:", user.uid);
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/login') }
            ]);

        } catch (error: any) {
            console.error("Full error details:", {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            
            let errorMessage = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (error.code === 'permission-denied') {
                errorMessage = 'Database error. Please contact support.';
                console.error("Firestore permission denied - check your security rules");
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (error: any) => {
        let errorMessage = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled.';
                break;
            case 'permission-denied':
                errorMessage = 'Database permission denied. Check your Firestore rules.';
                break;
            default:
                errorMessage = error.message || errorMessage;
        }
        
        Alert.alert('Error', errorMessage);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Get Started</Text>
                        <Text style={styles.subHeaderText}>Welcome to TNK - Let's create your account!</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your first name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Last Name <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your last name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    style={styles.passwordTextInput}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <MaterialIcons
                                        name={showPassword ? 'visibility-off' : 'visibility'}
                                        size={24}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    style={styles.passwordTextInput}
                                    placeholder="Re-type your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <MaterialIcons
                                        name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                                        size={24}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.signupButton, loading && styles.disabledButton]}
                            onPress={signUp}
                            disabled={loading}
                        >
                            <Text style={styles.signupButtonText}>
                                {loading ? 'Creating account...' : 'Sign up'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: height * 0.02,
        marginTop: height * 0.1,
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'center',
        width: '100%',
    },
    subHeaderText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        width: '100%',
    },
    formContainer: {
        backgroundColor: '#F7EDE1',
        borderRadius: 20,
        padding: 20,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 13,
    },
    required: {
        color: 'red',
    },
    input: {
        backgroundColor: '#D9D9D9',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#999',
        fontSize: 14,
        height: 40,
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#999',
        height: 40,
    },
    passwordTextInput: {
        flex: 1,
        fontSize: 14,
        height: 40,
    },
    signupButton: {
        backgroundColor: '#FFC200',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        height: 45,
    },
    disabledButton: {
        opacity: 0.7,
    },
    signupButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    loginLink: {
        color: '#C98633',
        fontWeight: 'bold',
        fontSize: 13,
    },
});

export default Register;