import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useFonts } from 'expo-font'; 

const HouseholdDetails = () => {
  const [fontsLoaded] = useFonts({
    'RobotoSlab-Medium': require('@/assets/fonts/RobotoSlab-Medium.ttf'),
  });

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
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <Bell
              color={'white'}
              size={24}
              style={{ marginRight: 15 }}
              onPress={() => {}}
            />
          ),
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#020D19' }}>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.textFive}>Households</Text>
        </View>

        <View style={styles.hcontainer}>

        <View style={styles.starContainer}>
          <Image source={require('@/assets/images/star.png')} style={styles.sstyle} />
          <Text style={styles.textSix}>
            4.8(53)
          </Text>
        </View>

          <View style={styles.detailscontainer}>
            <Image source={require('@/assets/images/house.jpg')} style={styles.istyle} />
            <View style={styles.housedetails}>
              <Text style={styles.textTwo}>
                Owner: Mr. Kittens
              </Text>

              <View style={styles.reqContainer}>
                <Text style={styles.textTwo}>
                  Required:
                </Text>

                <View style={styles.typesContainer}>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Errands
                    </Text>
                  </View>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Odd Jobs
                    </Text>
                  </View>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Cleaning
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.soloReq}>
                <View style={styles.typesContainer}>
                  <View style={styles.buttonEStyle}>
                    <Text style={styles.textThree}>
                      Others
                    </Text>
                  </View>
                </View>
              </View>

            <View style={styles.ratesRow}>
              <Text style={styles.textTwo}>
                Rates:
              </Text>
              <Text style={styles.textFour}>
                5,000.00 /month
              </Text>
            </View>

            <View style={styles.soloRate}>
              <Text style={styles.textFour}>
                400.00 /service
              </Text>
            </View>

            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.buttonAStyle}>
                <Text style={styles.textOne}>
                  View User Profile
                </Text>
              </View>

              <View style={styles.buttonBStyle}>
                <Text style={styles.textOne}>
                  Apply
                </Text>
              </View>
            </View>
            <View style={styles.buttonCStyle}>
              <Text style={styles.textOne}>
                Message
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hcontainer}>

          <View style={styles.starContainer}>
            <Image source={require('@/assets/images/star.png')} style={styles.sstyle} />
            <Text style={styles.textSix}>
              4.5(20)
            </Text>
          </View>

          <View style={styles.detailscontainer}>

            <Image source={require('@/assets/images/house2.jpg')} style={styles.istyle} />
            <View style={styles.housedetails}>
              <Text style={styles.textTwo}>
                Owner: Sarah T. Nanim
              </Text>

              <View style={styles.reqContainer}>
                <Text style={styles.textTwo}>
                  Required:
                </Text>

                <View style={styles.typesContainer}>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Errands
                    </Text>
                  </View>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Odd Jobs
                    </Text>
                  </View>
                  <View style={styles.buttonDStyle}>
                    <Text style={styles.textThree}>
                      Cleaning
                    </Text>
                  </View>
                </View>
              </View>

            <View style={styles.ratesRow}>
              <Text style={styles.textTwo}>
                Rates:
              </Text>
              <Text style={styles.textFour}>
                2,500.00 /month
              </Text>
            </View>

            <View style={styles.soloRate}>
              <Text style={styles.textFour}>
                150.00 /service
              </Text>
            </View>

            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.buttonAStyle}>
                <Text style={styles.textOne}>
                  View User Profile
                </Text>
              </View>

              <View style={styles.buttonBStyle}>
                <Text style={styles.textOne}>
                  Apply
                </Text>
              </View>
            </View>
            <View style={styles.buttonCStyle}>
              <Text style={styles.textOne}>
                Message
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  hcontainer: {
    backgroundColor: '#F7EDE1',
    height: '32%',
    width: '90%',
    borderRadius: 11,
    margin: '5%',
    marginBottom: '-2%',
    padding: 20,
    paddingTop: '3%'
  },
  textOne: {
    color: 'white',
    fontSize: 9,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Medium', 
  },
  textTwo: {
    color: 'black',
    fontSize: 9,
    textAlign: 'left',
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: '9%',
  },
  textThree: {
    color: 'black',
    fontSize: 7,
    textAlign: 'center',
    fontFamily: 'RobotoSlab-Medium',
    marginBottom: '6%',
  },
  textFour: {
    color: 'black',
    fontSize: 10,
    textAlign: 'left',
    fontFamily: 'RobotoSlab-Medium',
    marginLeft: '10%'
  },
  textFive: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'RobotoSlab-Medium',
    marginLeft: '5%'
  },
  textSix: {
    color: 'black',
    fontSize: 7,
    textAlign: 'left',
    fontFamily: 'RobotoSlab-Medium',
  },
  detailscontainer: {
    width: '100%',
    height: '60%',
    marginBottom: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonsContainer: {},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2%',
  },
  buttonAStyle: {
    backgroundColor: '#020D19',
    borderRadius: 11,
    width: '40%',
    padding: '2%',
  },
  buttonBStyle: {
    backgroundColor: '#A25D67',
    borderRadius: 11,
    width: '25%',
    padding: '2%',
  },
  buttonCStyle: {
    backgroundColor: '#020D19',
    borderRadius: 11,
    width: '25%',
    marginLeft: '75%',
    padding: '2%',
  },
  buttonDStyle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 11,
    width: '25%',
    height: 13,
    marginRight: 3
  },
  buttonEStyle: {
    backgroundColor: '#D9D9D9',
    borderRadius: 11,
    width: '32.5%',
    height: 13
  },
  istyle: {
    height: '100%',
    width: '40%',
    marginRight: '2%'
  },
  housedetails: {
    marginRight: '15%',
  },
  reqContainer: {
    flexDirection: 'row',
  },
  typesContainer: {
    flexDirection: 'row',
    width: '70%',
  },
  soloReq: {
    marginLeft: '18%',
    marginTop: '-8%',
  },
  ratesRow: {
    flexDirection: 'row',
  },
  soloRate: {
    marginLeft: '13%',
    marginTop: '-8%',
  },
  starContainer: {
    flexDirection: 'row',
    marginLeft: '87%',
  },
  sstyle: {
    height: 10,
    width: 10,
  },
});

export default HouseholdDetails;