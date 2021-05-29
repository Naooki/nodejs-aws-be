import { JSONSchemaType } from "ajv";

import { ProductCreateDto } from "src/interfaces/Product";

// @ts-ignore
export const createProductSchema: JSONSchemaType<ProductCreateDto> = {
  type: "object",
  properties: {
    title: { type: "string", nullable: false, minLength: 1 },
    description: { type: "string" },
    price: { type: "number", minimum: 0, nullable: false },
    count: { type: "number", minimum: 0, nullable: true },
  },
  required: ["title", "description", "price"],
  additionalProperties: false,
};
// @ts-ignore
export const getProductByIdSchema: JSONSchemaType<{ productId: string }> = {
  type: "object",
  properties: {
    productId: { type: "string", format: "uuid", nullable: false },
  },
  required: ["productId"],
  additionalProperties: false,
};

// @ts-ignore
export const getProductsListSchema: JSONSchemaType<{ search?: string, limit?: number }> = {
  type: "object",
  properties: {
    search: { type: "string" },
    limit: { type: "number", minimum: 1 }
  },
  additionalProperties: false,
};
