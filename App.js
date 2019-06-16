
import React, { Component } from 'react';

import { Button, StyleSheet, Platform, View, ActivityIndicator, FlatList, Text, Image, Alert, YellowBox } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json

class Metro extends Component {

 constructor(props) {

   super(props);

   this.state = {

     isLoading: true

   }

   YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
  ]);

 }

GetItem (title) {

 Alert.alert(title);

 }

 FlatListItemSeparator = () => {
   return (
     <View
       style={{
         height: .5,
         width: "100%",
         backgroundColor: "#000",
       }}
     />
   );
 }

   componentDidMount(){
     return fetch('http://192.168.0.10:4000/api/books')
       .then((response) => response.json())
       .then((responseJson) => {

         this.setState({
           isLoading: false,
           dataSource: responseJson.books,
         }, function(){

         });

       })
       .catch((error) =>{
         console.error(error);
       });
   }

 render() {

   if (this.state.isLoading) {
     return (

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

         <ActivityIndicator size="large" />

       </View>

     );

   }

   return (

     <View style={styles.MainContainer}>

       <FlatList

        data={ this.state.dataSource }

        ItemSeparatorComponent = {this.FlatListItemSeparator}

        renderItem={({item}) =>

            <View style={{flex:1, flexDirection: 'row'}}>

              <Image source = {{ uri: item.image }} style={styles.imageView} />

              <Text onPress={() => {

               /* 1. Navigate to the Details route with params */
                this.props.navigation.navigate('Details', {
                  isbn: item.isbn
                });

              }}
                style={styles.textView}>{item.title}</Text>
            </View>

          }

        keyExtractor={(item, id) => id.toString()}

        />

     </View>
   );
 }
}

class DetailsScreen extends React.Component {
  render() {
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    const isbn = navigation.getParam('isbn', 'NO-ID');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Text>isbn: {JSON.stringify(isbn)}</Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: Metro,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}




const styles = StyleSheet.create({

MainContainer :{

    justifyContent: 'center',
    flex:1,
    margin: 5,
    marginTop: (Platform.OS === 'ios') ? 20 : 0,

},

imageView: {

    width: '50%',
    height: 100 ,
    margin: 7,
    borderRadius : 7

},

textView: {

    width:'50%',
    textAlignVertical:'center',
    padding:10,
    color: '#000'

}

});
