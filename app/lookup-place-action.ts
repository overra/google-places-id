"use server";
import { action } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

// This demonstrates different ways of getting data on the client from the backend
// 1. Using a Server Action with <form>'s (almost done)
// 2. Using `next-safe-action` to create type-safe functions you can call from the client without using a <form> (not done)
// 3. Detecting `searchParams` in a server component and preloading data into the client component (not done)

// 1. Using built-in Server Actions with a form. i.e. <form action={lookupPlaceFormAction}></form>
// https://nextjs.org/docs/app/api-reference/functions/server-actions
const lookupPlaceFormActionSchema = zfd.formData({
  placeId: zfd.text(),
});

export async function lookupPlaceFormAction(
  prevState: any,
  data: FormData
): Promise<LookupPlaceFormState> {
  const values = lookupPlaceFormActionSchema.parse(data);
  try {
    const placeData = await lookupPlace(values.placeId);
    revalidatePath(`/?placeId=${values.placeId}`);
    console.log(JSON.stringify({ placeData }, null, 2));
    return { message: "success", data: placeData };
  } catch (err) {
    if (err instanceof Error) {
      console.error(JSON.stringify(err, null, 2));
      return { message: "error", error: err.message };
    }
    console.error(err);
    return { message: "error", error: "Unexpected error" };
  }
}

export type LookupPlaceFormState =
  | { message: null }
  | { message: "success"; data: any }
  | { message: "error"; error: string };

// ---

// 2. Using `next-safe-action` for using Server Actions without a form
// `next-safe-action` Docs: https://next-safe-action.dev
const safeActionSchema = z.object({
  placeId: z.string(),
});

export const lookupPlaceAction = action(
  safeActionSchema,
  async ({ placeId }) => {
    console.log("lookupPlaceAction", placeId);
    if (placeId) {
      const data = await lookupPlace(placeId);
      return { message: "success", data };
    }
    return { message: "error" };
  }
);

export async function lookupPlace(placeId: string) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress&key=${process.env.GOOGLE_PLACES_API_KEY}&languageCode=en`
  );
  const data = await res.json();
  return data;
}
