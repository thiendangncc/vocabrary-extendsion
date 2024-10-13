// BaseModel.ts
import { ref, set, get, child, remove } from "firebase/database";
import { firebaseDatabase } from "../utils/firebase";

class BaseModel<T> {
  private dbRef: string;

  constructor(collectionName: string) {
    this.dbRef = collectionName;
  }

  async create(id: string, data: T): Promise<void> {
    try {
      await set(ref(firebaseDatabase, `${this.dbRef}/${id}`), data);
    } catch (error) {
      console.error("Error creating data: ", error);
      throw new Error("Failed to create data");
    }
  }

  async read(id: string): Promise<T | null> {
    try {
      const snapshot = await get(
        child(ref(firebaseDatabase), `${this.dbRef}/${id}`)
      );
      if (snapshot.exists()) {
        return snapshot.val() as T;
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error reading data: ", error);
      return null;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      await set(ref(firebaseDatabase, `${this.dbRef}/${id}`), data);
    } catch (error) {
      console.error("Error updating data: ", error);
      throw new Error("Failed to update data");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await remove(ref(firebaseDatabase, `${this.dbRef}/${id}`));
    } catch (error) {
      console.error("Error deleting data: ", error);
      throw new Error("Failed to delete data");
    }
  }
}

export default BaseModel;
