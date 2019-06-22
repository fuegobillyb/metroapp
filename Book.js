import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    YellowBox
} from 'react-native';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

export default class BookScreen extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            isLoading: true,
            tableHead: ['Available', 'Library'],
            tableData: []
        };

        this.arrayholder = [];
        const {navigation} = this.props;
        this.isbn = navigation.getParam('isbn');

        YellowBox.ignoreWarnings([
            'Warning: componentWillMount is deprecated',
            'Warning: componentWillReceiveProps is deprecated',
        ]);
    }

    componentDidMount() {
        return fetch(`http://192.168.0.8:4000/api/books/${this.isbn}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                        isLoading: false,
                        author_id: responseJson.book.author.author.id,
                        author: `${responseJson.book.author.author.last_name}, ${responseJson.book.author.author.first_name}`,
                        summary: responseJson.book.summary,
                        image: responseJson.book.image,
                        tableData: responseJson.book.copies.map(function (copy) { return [copy.copy["checked_out?"].toString(), copy.copy.library]})
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
                    <Text onPress={() => {
                        /* 1. Navigate to the Author route with params */
                        this.props.navigation.navigate('Author', {
                            author_id: this.state.author_id
                        });
                    }}>{this.state.author} </Text>
                    <Image source={{uri: this.state.image}} style={styles.imageView2}/>
                    <Text>{this.state.summary} </Text>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text}/>
                        <Rows data={this.state.tableData} textStyle={styles.text}/>
                    </Table>
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
});

