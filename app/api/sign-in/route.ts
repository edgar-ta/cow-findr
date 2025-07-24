import { Configuration } from "../configuration";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    // Parse email and password from the request body
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400 }
      );
    }

    const db = Configuration.db;

    // Query the users collection for a document with the matching email and password
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password." }),
        { status: 401 }
      );
    }

    // If a matching document is found, return success
    return new Response(
      JSON.stringify({ message: "Sign-in successful." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred during sign-in." }),
      { status: 500 }
    );
  }
}