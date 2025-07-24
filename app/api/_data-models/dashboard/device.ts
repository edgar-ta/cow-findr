import { DeviceModel } from "../device";

export type Dashboard_DeviceModel = Omit<DeviceModel, "readings"> & { 
    id: string; 
    lastPosition: [number, number] | null;
};

// export type Dashboard_DeviceModel = {
//     active: boolean;
//     activation_code: string;
//     label: string;
//     hardware_id: string;
//     id: string; 
//     lastPosition: [number, number] | null;
// };
