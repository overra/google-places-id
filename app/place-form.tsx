"use client";
import { useFormState, useFormStatus } from "react-dom";
import {
  LookupPlaceFormState,
  lookupPlaceFormAction,
} from "./lookup-place-action";
import { PropsWithChildren } from "react";

type Props = {
  placeId: string;
  placeData?: any;
};

export function PlaceIDForm(props: Props) {
  const [state, formAction] = useFormState<LookupPlaceFormState, FormData>(
    lookupPlaceFormAction,
    {
      message: props.placeData ? "success" : null,
      data: props.placeData,
    }
  );

  state;
  return (
    <>
      <form action={formAction} className="p-4">
        <input
          name="placeId"
          defaultValue={props.placeId}
          className="border border-slate-500 rounded-md p-2 w-96"
        />
        <SubmitButton>Lookup</SubmitButton>
        {state.message === "error" ? (
          <div className="text-red-500">Error: {state.error}</div>
        ) : null}

        {state.message === "success" ? (
          <pre>{JSON.stringify(state.data, null, 2)}</pre>
        ) : null}
      </form>
    </>
  );
}

function SubmitButton({ children }: PropsWithChildren<{}>) {
  const status = useFormStatus();
  const { pending } = status;
  console.log({ status });
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="bg-slate-300 ml-4 py-2 px-4 rounded:md disabled:text-slate-400"
    >
      {pending ? "Loading..." : children}
    </button>
  );
}
