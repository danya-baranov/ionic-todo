export interface ItemViewModel {
    id?: number;
    title: string;
    text: string;
    photos: any;
    completed: boolean;
    latLng: ItemViewModelGeo;
    userId: string;
}
export interface ItemViewModelGeo {
    lat: number;
    lng: number;
}
