import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const EventPicture = ({ imageUrl, title }) => {
    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardMedia
                component="img"
                alt={title || "Event Picture"}
                height="140"
                image={imageUrl}
                sx={{ objectFit: 'cover' }}
            />
            {title && (
                <CardContent>
                    <Typography variant="caption" color="textSecondary">
                        {title}
                    </Typography>
                </CardContent>
            )}
        </Card>
    );
};

export default EventPicture;
