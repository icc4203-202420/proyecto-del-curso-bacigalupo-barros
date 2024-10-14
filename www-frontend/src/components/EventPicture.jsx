import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import TagUsers from './TagUsers';

const EventPicture = ({ imageUrl, pictureId }) => {
    const handleTagUser = (photoTag) => {
        console.log('User tagged:', photoTag);
    };

    console.log("Picture ID:", pictureId);

    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt="Event picture"
            />
            <CardContent>
                {pictureId && (
                    <TagUsers eventPictureId={pictureId} onTagUser={handleTagUser} />
                )}
                <Typography variant="body2" color="text.secondary">
                    Picture ID: {pictureId}  
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EventPicture;
