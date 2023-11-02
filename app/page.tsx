"use server";
import { PlaceIDForm } from "./place-form";
import { lookupPlace } from "./lookup-place-action";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: { placeId: string };
}) {
  const { placeId } = searchParams;
  let placeData;
  if (placeId) {
    placeData = await lookupPlace(placeId);
  }
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <PlaceIDForm placeId={placeId} placeData={placeData} />
      </Suspense>
    </>
  );
}
