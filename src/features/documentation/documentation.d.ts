export interface Documentation {
  id: string;
  moduleId: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentationListItem {
  id: string;
  moduleId: string;
  title: string;
  text: string;
}

export interface CreateDocumentationInput {
  title: string;
  text: string;
}