import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
const VisitProfile = () => {
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
                
            </View>
        </>
    );
};

const styles = StyleSheet.create({

});

export default VisitProfile;