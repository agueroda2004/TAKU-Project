import type {
  CreateDocumentationInput,
  Documentation,
  DocumentationListItem,
} from "../documentation";

type DocumentationFormSource = Pick<Documentation, "title" | "text">;

export function documentationToFormState(
  documentation: DocumentationFormSource
): CreateDocumentationInput {
  return {
    title: documentation.title,
    text: documentation.text,
  };
}

/**
 * Mapea un `DocumentationListItem` a la entrada aceptada por el formulario de
 * creación / edición. Equivalente a `documentationToFormState` pero tipado
 * explícitamente para los ítems que devuelve `useDocumentations`.
 */
export function documentationListItemToFormState(
  documentation: DocumentationListItem
): CreateDocumentationInput {
  return {
    title: documentation.title,
    text: documentation.text,
  };
}

/**
 * Convierte un bloque de Markdown en texto plano "legible" para mostrar como
 * extracto en la card colapsada (sin #, *, _, >, links, imágenes, fences de
 * código, etc.). No es un parser completo: solo quita la sintaxis más común
 * para que el excerpt no muestre caracteres raros de Markdown.
 */
export function markdownToPlainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}