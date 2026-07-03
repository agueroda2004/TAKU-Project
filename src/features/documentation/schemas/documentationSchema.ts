import { z } from "zod";

export const documentationSchema = z.object({
  title: z
    .string({ error: "El título es obligatorio." })
    .trim()
    .min(1, { error: "El título es obligatorio." })
    .max(150, {
      error: "El título no puede tener más de 150 caracteres.",
    }),

  text: z
    .string({ error: "El contenido es obligatorio." })
    .min(1, { error: "El contenido es obligatorio." })
    .max(50000, {
      error: "El contenido no puede tener más de 50000 caracteres.",
    }),
});

export type DocumentationFormInput = z.input<typeof documentationSchema>;
export type DocumentationFormOutput = z.output<typeof documentationSchema>;

export type DocumentationFieldErrors = Partial<{
  title: string;
  text: string;
}>;

export function formatDocumentationErrors(
  error: z.ZodError
): DocumentationFieldErrors {
  const { fieldErrors } = z.flattenError(error) as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  return {
    title: fieldErrors.title?.[0],
    text: fieldErrors.text?.[0],
  };
}