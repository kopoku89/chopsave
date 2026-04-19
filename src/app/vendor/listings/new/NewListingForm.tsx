"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";

import { createDeal, type NewDealState } from "./actions";

export function NewListingForm({
  defaultPickupStart,
  defaultPickupEnd,
}: {
  defaultPickupStart: string;
  defaultPickupEnd: string;
}) {
  const initial: NewDealState = {};
  const [state, formAction] = useActionState(createDeal, initial);

  return (
    <form action={formAction} className="space-y-4 pb-6">
      <Field label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          placeholder="e.g. Jollof + Grilled Chicken Box"
          required
        />
      </Field>

      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          placeholder="What's inside, portion size, tasting notes…"
          required
        />
      </Field>

      <Field
        label="Image URL"
        htmlFor="imageUrl"
        hint="Optional"
      >
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Original price (GHS)" htmlFor="originalPriceCedis">
          <Input
            id="originalPriceCedis"
            name="originalPriceCedis"
            type="number"
            step="0.5"
            min="1"
            placeholder="60.00"
            required
          />
        </Field>
        <Field label="Deal price (GHS)" htmlFor="discountedPriceCedis">
          <Input
            id="discountedPriceCedis"
            name="discountedPriceCedis"
            type="number"
            step="0.5"
            min="1"
            placeholder="35.00"
            required
          />
        </Field>
      </div>

      <Field label="Quantity available" htmlFor="quantityTotal">
        <Input
          id="quantityTotal"
          name="quantityTotal"
          type="number"
          min="1"
          placeholder="10"
          defaultValue={10}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Pickup start" htmlFor="pickupStart">
          <Input
            id="pickupStart"
            name="pickupStart"
            type="datetime-local"
            defaultValue={defaultPickupStart}
            required
          />
        </Field>
        <Field label="Pickup end" htmlFor="pickupEnd">
          <Input
            id="pickupEnd"
            name="pickupEnd"
            type="datetime-local"
            defaultValue={defaultPickupEnd}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category" htmlFor="category" hint="Optional">
          <Input
            id="category"
            name="category"
            placeholder="Main, Snack, Bakery…"
          />
        </Field>
        <Field label="Tags" htmlFor="tags" hint="Comma-separated">
          <Input id="tags" name="tags" placeholder="jollof, chicken" />
        </Field>
      </div>

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div
        className="sticky bottom-0 -mx-5 border-t border-surface-border bg-white px-5 pt-3"
        style={{ paddingBottom: "max(var(--safe-bottom), 14px)" }}
      >
        <Submit />
      </div>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth size="xl" disabled={pending}>
      {pending ? "Publishing…" : "Publish deal"}
    </Button>
  );
}
