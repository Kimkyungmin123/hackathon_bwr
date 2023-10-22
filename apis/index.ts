import { database } from "@/config/firebase";
import {
  FirebaseRefType,
  RestaurantListType,
  ReviewType,
  UserType,
} from "@/types";
import { formatTimestamptoString } from "@/util/timstampToString";
import dayjs from "dayjs";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

const restaurantListCollection = collection(
  database,
  FirebaseRefType.RESTAURANT_LIST
);

const reviewCollection = collection(database, FirebaseRefType.REVIEW);

export const formatTimestamp = (timestamp: Timestamp): string => {
  if (!timestamp) {
    return "-";
  }
  return formatTimestamptoString(timestamp.nanoseconds, timestamp.seconds);
};

export const createUser = async (data: UserType) => {
  const userRef = doc(database, FirebaseRefType.USERS, data.uid);
  await setDoc(userRef, data, { merge: true });
  return await getDoc(userRef);
};

export async function getRestaurantList(
  setData: Dispatch<SetStateAction<RestaurantListType[]>>
) {
  const queryRef = query(
    restaurantListCollection,
    orderBy("created_at", "desc")
  );

  const querySnapshot = onSnapshot(queryRef, (snapshot) => {
    const array = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        created_at: formatTimestamp(doc.data().created_at),
        updated_at: formatTimestamp(doc.data().updated_at),
      };
    });

    setData(array as RestaurantListType[]);
  });
  return () => {
    querySnapshot();
  };
}

export async function addRestaurantContent(addData: RestaurantListType) {
  await addDoc(restaurantListCollection, addData);
}

export async function getRestaurantContentById(docId: string) {
  const docRef = doc(database, FirebaseRefType.RESTAURANT_LIST, docId);
  const docSnap = await getDoc(docRef);
  const snapshotData = docSnap.data();

  return {
    ...snapshotData,
    id: docId,
    created_at: formatTimestamp(snapshotData?.created_at),
    updated_at: formatTimestamp(snapshotData?.updated_at),
  } as RestaurantListType;
}

export async function updateRestaurantContent(
  data: RestaurantListType,
  docId: string
) {
  const docRef = doc(database, FirebaseRefType.RESTAURANT_LIST, docId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const updatedData = {
      ...data,
      updated_at: new Date(),
    };

    await updateDoc(docRef, updatedData);
  } else {
    console.error("Document does not exist");
  }
}

export async function deleteRestaurantContent(id: string) {
  const projectDocRef = doc(restaurantListCollection, id);

  const projectDoc = await getDoc(projectDocRef);

  if (projectDoc.exists()) {
    await deleteDoc(projectDocRef);
  } else {
    console.error("Document does not exist");
  }
}

export async function getReviewList(
  setData: Dispatch<SetStateAction<ReviewType[]>>
) {
  const queryRef = query(reviewCollection, orderBy("created_at", "desc"));

  const querySnapshot = onSnapshot(queryRef, (snapshot) => {
    const array = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
        created_at: formatTimestamp(doc.data().created_at),
      };
    });

    setData(array as ReviewType[]);
  });
  return () => {
    querySnapshot();
  };
}

export async function addReview(addData: ReviewType) {
  const docRef = await addDoc(reviewCollection, {});

  const { id } = docRef;
  const docIdWithData = {
    ...addData,
    id,
  };

  await setDoc(docRef, docIdWithData);

  return docIdWithData;
}

export async function deleteReview(id: string) {
  const doccRef = doc(reviewCollection, id);

  const reviewDoc = await getDoc(doccRef);

  if (reviewDoc.exists()) {
    await deleteDoc(doccRef);
  } else {
    console.error("Document does not exist");
  }
}
