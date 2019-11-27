import React from 'react';
import { View, Flatlist, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Menu(props) {

    const renderMenuItem = ({ item, index }) => {

        return (
            <ListItem
                title={item.name}
                subtitle={item.description}
                leftAvatar={{ source: require('./images/uthappizza.png') }}
            />

        );
    };

    return (
        <FlatList
            data={props.dishes}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}

export default Menu;