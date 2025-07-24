import { Configuration } from "../configuration";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { DeviceReadingModel } from "../_data-models/device-reading";
import { DevicePreview_Device } from "../_data-models/device-preview/device";

export async function POST(request: Request) {
  try {
    const { deviceId } = await request.json();

    if (!deviceId) {
      return new Response(
        JSON.stringify({ error: "Device ID is required." }),
        { status: 400 }
      );
    }

    const device = await getDeviceData(deviceId);

    return new Response(JSON.stringify(device), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Couldn't use the provided cellphone." }),
      { status: 500 }
    );
  }
}

async function getDeviceData(deviceId: string): Promise<DevicePreview_Device> {
  
  const deviceCollection = collection(Configuration.db, "devices");
  const deviceRef = doc(deviceCollection, deviceId);

  const [ deviceSnapshot, readings ] = await Promise.all([
    getDoc(deviceRef),
    getDeviceReadings(deviceId)
  ]);
  const deviceData = deviceSnapshot.data();

  return ({
    activation_code: deviceData?.activation_code || "",
    active: deviceData?.active || false,
    hardware_id: deviceData?.hardware_id || "",
    label: deviceData?.label || "",
    readings,
  });
}

async function getDeviceReadings(deviceId: string): Promise<DeviceReadingModel[]> {
  const db = Configuration.db;
  const readingsCollection = collection(db, `devices/${deviceId}/readings`);
  const querySnapshot = await getDocs(readingsCollection);

  const readings: DeviceReadingModel[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      position: [data.position.latitude, data.position.longitude], // Convert GeoPoint to array
      temperature: data.temperature,
      humidity: data.humidity,
      wind: data.wind,
      clouds: data.clouds,
      condition: data.condition,
      thi: data.thi,
      activity: data.activity,
      cowWelfare: data.cowWelfare,
      time: data.time.toDate(), // Convert Firestore Timestamp to JavaScript Date
    };
  });

  return readings;
}