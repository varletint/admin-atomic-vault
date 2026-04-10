import { useCallback, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { NumberInput } from "@/components/ui/NumberInput";
import { ImageUploader } from "./ImageUploader";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductFormValues,
  type UpdateProductFormValues,
} from "@/schemas/productSchema";
import type { Product } from "../types";

interface ImageFileEntry {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Product>;
  onSubmit: (
    data: Record<string, unknown>,
    imageFiles: ImageFileEntry[]
  ) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function ProductForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
}: ProductFormProps) {
  const [imageFiles, setImageFiles] = useState<ImageFileEntry[]>([]);

  const schema = mode === "create" ? createProductSchema : updateProductSchema;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormValues | UpdateProductFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      price: defaultValues?.price !== undefined ? defaultValues.price / 100 : 0,
      compareAtPrice:
        defaultValues?.compareAtPrice !== undefined
          ? defaultValues.compareAtPrice / 100
          : undefined,
      costPrice:
        defaultValues?.costPrice !== undefined
          ? defaultValues.costPrice / 100
          : undefined,
      category: defaultValues?.category ?? "",
      images: defaultValues?.images ?? [],
      brand: defaultValues?.brand ?? "",
      tags: defaultValues?.tags?.join(", ") ?? "",
      hasVariants: defaultValues?.hasVariants ?? false,
      variantOptionNames: defaultValues?.variantOptionNames?.join(", ") ?? "",
      variants:
        defaultValues?.variants?.map((v) => ({
          ...v,
          price: v.price !== undefined ? v.price / 100 : 0,
        })) ?? [],
      productType: defaultValues?.productType ?? "physical",
      weightUnit: defaultValues?.weightUnit ?? "g",
      weight: defaultValues?.weight,
      material: defaultValues?.material ?? "",
      careInstructions: defaultValues?.careInstructions ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      minOrderQty: defaultValues?.minOrderQty ?? 1,
      ...(mode === "create" ? { initialStock: 0 } : {}),
    },
  });

  const hasVariants = watch("hasVariants");
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" as any });

  const onImagesChange = useCallback((files: ImageFileEntry[]) => {
    setImageFiles(files);
  }, []);

  const handleFormSubmit = (
    data: CreateProductFormValues | UpdateProductFormValues
  ) => {
    const processed: Record<string, unknown> = { ...data };

    // Convert monetary values (entered as Naira) to Kobo and round to prevent floating-point drift
    if (typeof processed.price === "number") {
      processed.price = Math.round(processed.price * 100);
    }
    if (typeof processed.compareAtPrice === "number") {
      processed.compareAtPrice = Math.round(processed.compareAtPrice * 100);
    }
    if (typeof processed.costPrice === "number") {
      processed.costPrice = Math.round(processed.costPrice * 100);
    }
    if (Array.isArray(processed.variants)) {
      processed.variants = processed.variants.map((v: any) => ({
        ...v,
        price:
          typeof v.price === "number" ? Math.round(v.price * 100) : v.price,
      }));
    }

    if (typeof processed.tags === "string") {
      processed.tags = (processed.tags as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (typeof processed.variantOptionNames === "string") {
      processed.variantOptionNames = (processed.variantOptionNames as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    onSubmit(processed, imageFiles);
  };

  const sectionHeader =
    "text-sm font-bold uppercase tracking-widest text-admin-ink mb-6 pb-3 border-b border-[var(--color-border)]";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
      {/* ── Basic Info ──────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Basic Information</h2>
        <div className='space-y-1'>
          <Input
            label='Product Name'
            placeholder='e.g. Premium Running Shoes'
            error={(errors as any).name?.message}
            {...register("name")}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Category'
              placeholder='e.g. Footwear'
              error={(errors as any).category?.message}
              {...register("category")}
            />
            <Input
              label='Brand'
              placeholder='e.g. Nike'
              error={(errors as any).brand?.message}
              {...register("brand")}
            />
          </div>
          <Controller
            name='productType'
            control={control}
            render={({ field }) => (
              <Select
                label='Product Type'
                options={[
                  { value: "physical", label: "Physical" },
                  { value: "digital", label: "Digital" },
                  { value: "service", label: "Service" },
                ]}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                error={(errors as any).productType?.message}
              />
            )}
          />
          <Input
            label='Short Description'
            placeholder='Brief one-liner'
            error={(errors as any).shortDescription?.message}
            {...register("shortDescription")}
          />
          <div>
            <label className='input-label' htmlFor='description'>
              Description
            </label>
            <textarea
              id='description'
              rows={4}
              placeholder='Detailed product description...'
              className={`input-field resize-none ${
                (errors as any).description ? "input-error" : ""
              }`}
              {...register("description")}
            />
            {(errors as any).description && (
              <span className='input-error-text'>
                {(errors as any).description.message}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Pricing</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Controller
            name='price'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='Price (₦)'
                currency
                placeholder='₦0'
                error={(errors as any).price?.message}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
          <Controller
            name='compareAtPrice'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='Compare-at Price'
                currency
                placeholder='Optional'
                error={(errors as any).compareAtPrice?.message}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
          <Controller
            name='costPrice'
            control={control}
            render={({ field }) => (
              <NumberInput
                label='Cost Price'
                currency
                placeholder='Optional'
                error={(errors as any).costPrice?.message}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>
      </section>

      {/* ── Variants ────────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <div className='flex items-center justify-between mb-6 pb-3 border-b border-[var(--color-border)]'>
          <h2 className='text-sm font-bold uppercase tracking-widest text-admin-ink m-0 border-0 p-0'>
            Variants
          </h2>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='hasVariants'
              className='w-4 h-4 accent-admin-accent'
              {...register("hasVariants")}
            />
            <label
              htmlFor='hasVariants'
              className='text-sm font-semibold text-admin-ink uppercase tracking-wide cursor-pointer'>
              Enable Variants
            </label>
          </div>
        </div>

        {hasVariants && (
          <div className='space-y-6'>
            <Input
              label='Variant Option Names'
              placeholder='e.g. Size, Color (comma-separated)'
              error={(errors as any).variantOptionNames?.message}
              {...register("variantOptionNames")}
            />

            <div>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-xs font-bold text-admin-ink uppercase tracking-wide'>
                  Variant List
                </h3>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() =>
                    appendVariant({
                      price: 0,
                      isActive: true,
                      variantOptions: [{ name: "", value: "" }],
                    } as any)
                  }>
                  Add Variant
                </Button>
              </div>

              {variantFields.length === 0 && (
                <div className='text-sm text-admin-muted py-4 text-center border border-dashed border-[var(--color-border)]'>
                  No variants added yet.
                </div>
              )}

              <div className='space-y-4'>
                {variantFields.map((field, index) => (
                  <div
                    key={field.id}
                    className='border border-[var(--color-border)] p-4 flex flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-bold uppercase tracking-wide'>
                        Variant {index + 1}
                      </span>
                      <button
                        type='button'
                        onClick={() => removeVariant(index)}
                        className='text-red-500 hover:text-red-700 text-xs font-bold uppercase'>
                        Remove
                      </button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <Controller
                        name={`variants.${index}.price` as any}
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            label='Price (₦)'
                            currency
                            placeholder='₦0'
                            error={
                              (errors as any).variants?.[index]?.price?.message
                            }
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        )}
                      />
                      <Input
                        label='Option Name'
                        placeholder='e.g. Size'
                        error={
                          (errors as any).variants?.[index]?.variantOptions?.[0]
                            ?.name?.message
                        }
                        {...register(
                          `variants.${index}.variantOptions.0.name` as any
                        )}
                      />
                      <Input
                        label='Option Value'
                        placeholder='e.g. XL'
                        error={
                          (errors as any).variants?.[index]?.variantOptions?.[0]
                            ?.value?.message
                        }
                        {...register(
                          `variants.${index}.variantOptions.0.value` as any
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Images ─────────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Product Images</h2>
        <ImageUploader onChange={onImagesChange} maxFiles={8} />
      </section>

      {/* ── Inventory ──────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Inventory</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {mode === "create" && (
            <NumberInput
              label='Initial Stock'
              placeholder='0'
              error={(errors as any).initialStock?.message}
              {...register("initialStock" as any)}
            />
          )}
          <NumberInput
            label='Minimum Order Qty'
            placeholder='1'
            error={(errors as any).minOrderQty?.message}
            {...register("minOrderQty")}
          />
        </div>
        <div className='mt-4 flex items-center gap-3'>
          <input
            type='checkbox'
            id='isFeatured'
            className='w-4 h-4 accent-admin-accent'
            {...register("isFeatured")}
          />
          <label
            htmlFor='isFeatured'
            className='text-sm font-semibold text-admin-ink uppercase tracking-wide cursor-pointer'>
            Featured Product
          </label>
        </div>
      </section>

      {/* ── Shipping ───────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Shipping & Details</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <NumberInput
            label='Weight'
            step='0.01'
            placeholder='Optional'
            error={(errors as any).weight?.message}
            {...register("weight")}
          />
          <Controller
            name='weightUnit'
            control={control}
            render={({ field }) => (
              <Select
                label='Weight Unit'
                options={[
                  { value: "g", label: "Grams (g)" },
                  { value: "kg", label: "Kilograms (kg)" },
                  { value: "lb", label: "Pounds (lb)" },
                  { value: "oz", label: "Ounces (oz)" },
                ]}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                error={(errors as any).weightUnit?.message}
              />
            )}
          />
          <Input
            label='Material'
            placeholder='e.g. Cotton, Leather'
            error={(errors as any).material?.message}
            {...register("material")}
          />
        </div>
      </section>

      {/* ── Tags ────────────────────── */}
      <section className='border border-[var(--color-border)] bg-admin-surface p-6'>
        <h2 className={sectionHeader}>Tags</h2>
        <Input
          label='Tags'
          placeholder='e.g. summer, casual, trending (comma-separated)'
          error={(errors as any).tags?.message}
          {...register("tags")}
        />
      </section>

      {/* ── Submit ──────────────────── */}
      <div className='flex items-center justify-end gap-4 pt-4 border-t border-[var(--color-border)]'>
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type='submit' isLoading={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Product"
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
