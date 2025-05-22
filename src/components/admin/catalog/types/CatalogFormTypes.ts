
import { z } from 'zod';

// Form validation schema
export const catalogFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  cover_image: z.string().min(1, 'Imagem de capa é obrigatória'),
  category_id: z.string().min(1, 'Categoria é obrigatória'),
});

export type CatalogFormValues = z.infer<typeof catalogFormSchema>;
