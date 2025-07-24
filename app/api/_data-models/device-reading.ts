export type DeviceReadingModel = {
    position: [ number, number ]; // saved as a GeoPoint in the database
    temperature: number; // °C
    humidity: number; // %
    wind: number; // m/s
    clouds: number; // %
    condition: string;  // e.g., "clear sky", "rain"
    thi: number; // Temperature-Humidity Index
    activity: number; // m/s2
    cowWelfare: string; // e.g., "Low activity"
    time: Date; // saved as Timestamp in the database
};
