import React, {Component} from 'react';

import {
    View,
    Text, StyleSheet, Image, FlatList
} from 'react-native';

export default class AuthorScreen extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

        };

        this.arrayholder = [];
        const {navigation} = this.props;
        this.author_id = navigation.getParam('author_id');
    }

    componentDidMount() {
        return fetch(`http://192.168.0.8:4000/api/authors/${this.author_id}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                        isLoading: false,
                        author: `${responseJson.author.last_name}, ${responseJson.author.first_name}`,
                        bio: responseJson.author.bio,
                        books: responseJson.author.books.books,
                        location: responseJson.author.location,
                        image: "http://www.clcmn.edu/wp-content/uploads/2018/06/CLCNoPhoto.jpg"

                    },
                    function () {
                    }
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View>
                <Text>{this.state.author}</Text>
                <Image source={{uri: this.state.image}} style={styles.imageView2}/>
                {/*<Text>{this.state.bio} </Text>*/}
                <FlatList

                    data={this.state.books}

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

const styles = StyleSheet.create({

    imageView2: {

        width: '100%',
        height: '50%%',
        margin: 7,
        borderRadius: 7

    },

    imageView: {

        width: '50%',
        height: 100,
        margin: 7,
        borderRadius: 7

    }
});

