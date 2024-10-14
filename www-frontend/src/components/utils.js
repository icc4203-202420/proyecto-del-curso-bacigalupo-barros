export const randomCoordinates = (center, range = 0.1) => {
    const lat = center.lat + (Math.random() - 0.5) * range;
    const lng = center.lng + (Math.random() - 0.5) * range;
    return { lat, lng };
};