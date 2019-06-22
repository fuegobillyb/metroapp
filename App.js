require('react-devtools-core').connectToDevTools({host: "http://192.168.0.8:8081"})

import React, {Component} from 'react';

import {
    StyleSheet,
    Platform,
    View,
    ActivityIndicator,
    FlatList,
    Text,
    Image,
    YellowBox
} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'; // Version can be specified in package.json
import {SearchBar} from 'react-native-elements';

class HomeScreen extends Component {

    constructor(props) {

        super(props);

        this.state = {
            search: '',
            isLoading: true

        };

        this.arrayholder = [];


        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
        ]);

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
    };

    componentDidMount() {
        return fetch('http://192.168.0.8:4000/api/books')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                        isLoading: false,
                        dataSource: responseJson.books,
                    },
                    function () {
                        this.arrayholder = responseJson.books;
                    }
                );

            })
            .catch((error) => {
                console.error(error);
            });
    }

    search = text => {
        console.log(text);
    };
    clear = () => {
        this.search.clear();
    };

    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            dataSource: newData,
            search: text,
        });
    }

    ListViewItemSeparator = () => {
        //Item sparator view
        return (
            <View
                style={{
                    height: 0.3,
                    width: '90%',
                    backgroundColor: '#080808',
                }}
            />
        );
    };

    render() {

        if (this.state.isLoading) {
            return (

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <ActivityIndicator size="large"/>

                </View>

            );

        }

        return (

            <View style={styles.MainContainer}>

                <SearchBar
                    round
                    lightTheme
                    searchIcon={{size: 24}}
                    onChangeText={text => this.SearchFilterFunction(text)}
                    onClear={text => this.SearchFilterFunction('')}
                    placeholder="Type Here..."
                    value={this.state.search}
                />

                <FlatList

                    data={this.state.dataSource}

                    ItemSeparatorComponent={this.FlatListItemSeparator}

                    renderItem={({item}) =>

                        <View style={{flex: 1, flexDirection: 'row'}}>

                            <Image source={{uri: item.image}} style={styles.imageView}/>

                            <Text onPress={() => {
                                this.props.navigation.navigate('Book', {
                                    isbn: item.isbn
                                });

                            }}
                                  style={styles.textView}>{item.title}</Text>
                        </View>

                    }
                    enableEmptySections={true}
                    style={{marginTop: 10}}
                    keyExtractor={(item, id) => id.toString()}

                />

            </View>
        );
    }
}

import BookScreen from './Book';
import AuthorScreen from './Author'

const RootStack = createStackNavigator(
    {
        Home: HomeScreen,
        Book: BookScreen,
        Author: AuthorScreen,
    },
    {
        initialRouteName: 'Home',
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer/>;
    }
}


const styles = StyleSheet.create({

    MainContainer: {

        justifyContent: 'center',
        flex: 1,
        margin: 5,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,

    },

    imageView: {

        width: '50%',
        height: 100,
        margin: 7,
        borderRadius: 7

    },

    textView: {

        width: '50%',
        textAlignVertical: 'center',
        padding: 10,
        color: '#000'

    }
});
