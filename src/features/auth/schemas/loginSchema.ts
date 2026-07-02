import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "El correo es obligatorio." })
    .trim()
    .min(1, { error: "El correo es obligatorio." })
    .pipe(z.email({ error: "Ingresa un correo válido." })),
  password: z
    .string({ error: "La contraseña es obligatoria." })
    .min(1, { error: "La contraseña es obligatoria." })
    .min(6, { error: "La contraseña debe tener al menos 6 caracteres." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginFieldErrors = Partial<Record<keyof LoginInput, string>>;

export function formatLoginErrors(error: z.ZodError<LoginInput>): LoginFieldErrors {
  const tree = z.treeifyError(error);
  const properties = tree.properties as
    | Record<string, { errors?: string[] }>
    | undefined;
  if (!properties) return {};

  return {
    email: properties.email?.errors?.[0],
    password: properties.password?.errors?.[0],
  };
}