export class ItemViewModel {
    id: string;
    title: string;
    text: string;
    photos: [];
    completed: boolean;
    latLng: {
        lat: number,
        lng: number,
    };
    userId: string;
}
