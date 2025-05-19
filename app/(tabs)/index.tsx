// Authored by: Jamarcus JanGavril C. Mariano
// Company: Schlaf Shön
// Project: Tabangi Na Ko
// [TNK-7] Home Tab Screen
// Description: As a user, I want to be able to choose to view Housekeeper candidates and/or Household offers.

import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet} from "react-native";
import { Bell, MoveRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';



const styles = StyleSheet.create ({
  container: {
    paddingBottom: 10,
    backgroundColor: '#F7EDE1',
    marginLeft: 20,
    width: '90.3%',
    borderRadius: 11,
  },
  imageStyle: {
    width: '100%', 
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'black',
    borderWidth: 1

  },
  rightSideText: {
    fontWeight: 'bold',
  }
});

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-primary">
      <View>
        <Bell 
          color={'white'}
          size={25}
          style={{
            marginLeft: 300,
            marginTop: 30
          }} 
        />
      </View>
      <View>
        <Text className="text-5xl text-white ml-5 font-bold">Connect and</Text>
        <Text className="text-5xl text-white ml-5 font-bold">Stay Clean!</Text>
      </View>

      <View>
        <Text className="text-2xl text-white ml-5 mt-5">Housekeepers</Text>
        <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/housekeepers/HousekeepersDetails')}>
          <Image source={require('@/assets/images/housekeeper_image.png')} style={styles.imageStyle}/>
          <View className="flex items-end">
            <Text className="font-bold pt-1 pr-2">
              View Candidates
              <View className="flex items-end">
                <MoveRight 
                  color={'black'}
                  size={12}
                  style={{
                    marginLeft: 2
                  }} 
                />
              </View>
            </Text>
          </View>
          </TouchableOpacity>   
        </View>
      </View> 
        
      
      <View>
        <Text className="text-2xl text-white ml-5 mt-3">Households</Text>
        <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/households/HouseholdDetails')}>
          <Image source={require('@/assets/images/household_image.png')} style={styles.imageStyle}/>
          <View className="flex items-end">
            <Text className="font-bold pt-1 pr-2">
              View Offers
              <View className="flex items-end">
                <MoveRight 
                  color={'black'}
                  size={12}
                  style={{
                    marginLeft: 2
                  }} 
                />
              </View>
            </Text>
          </View>
          </TouchableOpacity>  
        </View>
      </View>
      
    </View>
  );
}