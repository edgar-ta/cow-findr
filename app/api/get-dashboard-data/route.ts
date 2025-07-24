  import { Configuration } from "../configuration";
  import { collection, GeoPoint, getDocs, limit, orderBy, query } from "firebase/firestore";
  import { DeviceModel } from "../_data-models/device";
  import { DeviceReadingModel } from "../_data-models/device-reading";
  import { Dashboard_DeviceModel } from "../_data-models/dashboard/device";

function geoPointToArray(geoPoint: GeoPoint): [number, number] {
  return [geoPoint.latitude, geoPoint.longitude];
}

async function getLastPosition(
  deviceId: string
): Promise<[number, number] | null> {
  const db = Configuration.db;
  const readingsCollection = collection(db, `devices/${deviceId}/readings`);
  const q = query(readingsCollection, orderBy("time", "desc"), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const data = snapshot.docs[0].data();

  return geoPointToArray(data.position as GeoPoint) ?? null;
}

  async function getDevices(): Promise<Dashboard_DeviceModel[]> {
    const db = Configuration.db;
    const devicesCollection = collection(db, "devices");
    const querySnapshot = await getDocs(devicesCollection);

    const devices: Dashboard_DeviceModel[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
          active: data.active,
          activation_code: data.activation_code,
          label: data.label,
          hardware_id: data.hardware_id,
          id: doc.id,
          lastPosition: await getLastPosition(doc.id)
        };
      })
    );

    return devices;
  }

  export async function POST(request: Request) {
    try {
      const devices = await getDevices();
      return new Response(JSON.stringify(devices), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch devices." }),
        { status: 500 }
      );
    }
  }
