import { Configuration } from "@/app/api/configuration";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  GeoPoint,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NextRequest } from "next/server";

export type LoadData_Input = {
    id: string;
    lat: number;
    lon: number;
    temperature: number;
    humidity: number;
    wind: number;
    clouds: number;
    condition: string;
    thi: number;
    activity: string;
    welfare: string;
  };
  

export async function POST(request: NextRequest) {
  try {
    const db = Configuration.db;
    const body = (await request.json()) as LoadData_Input;

    // 1. Find the device by hardware_id
    const devicesRef = collection(db, "devices");
    const q = query(devicesRef, where("hardware_id", "==", body.id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Device not found." }),
        { status: 404 }
      );
    }

    const deviceDoc = querySnapshot.docs[0]; // assuming hardware_id is unique
    const deviceId = deviceDoc.id;

    const deviceRef = doc(db, "devices", deviceId);
    await updateDoc(deviceRef, { active: true });

    // 2. Build the reading object
    const reading = {
      position: new GeoPoint(body.lat, body.lon),
      temperature: body.temperature,
      humidity: body.humidity,
      wind: body.wind,
      clouds: body.clouds,
      condition: body.condition,
      thi: body.thi,
      activity: parseFloat(body.activity),
      cowWelfare: body.welfare,
      time: Timestamp.now(),
    };

    // 3. Save it to /devices/{deviceId}/readings
    const readingsRef = collection(db, `devices/${deviceId}/readings`);
    await addDoc(readingsRef, reading);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error storing reading:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
