import { init } from "aos";
import { UserModel } from "../_data-models/user";
import { Configuration } from "../configuration";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export async function POST(request: Request) {
  const user = await request.json();
  const db = Configuration.db;

  // Validate full name
  if (!user.fullName || !/^[a-zA-Z\s]+$/.test(user.fullName)) {
    throw new Error("Full name must contain only letters and spaces.");
  }

  // Validate phone
  if (!user.phone || !/\+\d+(\s\d+)*(\s\d+)/.test(user.phone)) {
    throw new Error("Phone number must match the format +123 456 789.");
  }

  // Validate password
  if (
    !user.password ||
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
      user.password
    )
  ) {
    throw new Error(
      "Password must contain uppercase, lowercase, symbols, and numbers."
    );
  }

  // Check if email already exists
  const usersCollection = collection(db, "users");
  const emailQuery = query(usersCollection, where("email", "==", user.email));
  const querySnapshot = await getDocs(emailQuery);

  if (!querySnapshot.empty) {
    throw new Error("Email is already registered.");
  }

  // Add user to the database
  await addDoc(usersCollection, user);
  return Response.json({ ok: true, init: { status: 200 } });
}
