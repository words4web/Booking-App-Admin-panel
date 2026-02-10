import { ZodSchema, ZodError } from 'zod'

export function toFormikValidationSchema(zodSchema: ZodSchema) {
  return {
    validate: async (obj: unknown) => {
      try {
        await zodSchema.parseAsync(obj)
      } catch (error) {
        if (error instanceof ZodError) {
          return error.formErrors.fieldErrors
        }
      }
    },
  }
}
