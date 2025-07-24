import { DeviceReadingModel } from "./device-reading";

export type DeviceModel = {
    active: boolean;
    activation_code: string;
    label: string;
    hardware_id: string;
    readings: DeviceReadingModel[];
};
