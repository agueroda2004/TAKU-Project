import { z } from "zod";

export const noteSchema = z.object({
  text: z
    .string({ error: "El texto es obligatorio." })
    .trim()
    .min(1, { error: "El texto es obligatorio." })
    .max(2000, {
      error: "El texto no puede tener más de 2000 caracteres.",
    }),
});

export type NoteFormInput = z.input<typeof noteSchema>;
export type NoteFormOutput = z.output<typeof noteSchema>;

export type NoteFieldErrors = Partial<{
  text: string;
}>;

export function formatNoteErrors(error: z.ZodError): NoteFieldErrors {
  const { fieldErrors } = z.flattenError(error) as {
    fieldErrors: Record<string, string[] | undefined>;
  };
  return {
    text: fieldErrors.text?.[0],
  };
}