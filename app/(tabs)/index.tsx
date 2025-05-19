import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MoveRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020D19',
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  mainTitle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 45,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#F7EDE1',
    borderRadius: 11,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default function Index() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Connect and</Text>
        <Text style={styles.mainTitle}>Stay Clean!</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Housekeepers</Text>
        <TouchableOpacity 
          style={styles.cardContainer}
          onPress={() => router.push('/housekeepers/HousekeepersDetails')}
        >
          <Image 
            source={require('@/assets/images/housekeeper_image.png')} 
            style={styles.cardImage}
          />
          <View style={styles.cardFooter}>
            <Text style={styles.cardText}>View Candidates</Text>
            <MoveRight color={'black'} size={12} />
          </View>
        </TouchableOpacity>   
      </View> 
      
      <View>
        <Text style={styles.sectionTitle}>Households</Text>
        <TouchableOpacity 
          style={styles.cardContainer}
          onPress={() => router.push('/households/HouseholdDetails')}
        >
          <Image 
            source={require('@/assets/images/household_image.png')} 
            style={styles.cardImage}
          />
          <View style={styles.cardFooter}>
            <Text style={styles.cardText}>View Offers</Text>
            <MoveRight color={'black'} size={12} />
          </View>
        </TouchableOpacity>  
      </View>
    </View>
  );
}