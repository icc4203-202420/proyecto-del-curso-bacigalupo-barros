import React from 'react';
import { View, Image, Text } from 'react-native';
import TagUsers from './TagUsers';

const EventPicture = ({ imageUrl, pictureId }) => {
    const handleTagUser = (photoTag) => {
        console.log('User tagged:', photoTag);
    };

    return (
        <View style={{ marginBottom: 20 }}>
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 140 }} />
            {pictureId && (
                <TagUsers eventPictureId={pictureId} onTagUser={handleTagUser} />
            )}
            <Text>Picture ID: {pictureId}</Text>
        </View>
    );
};

export default EventPicture;
