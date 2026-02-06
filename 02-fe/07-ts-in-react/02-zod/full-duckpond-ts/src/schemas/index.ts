import { z } from 'zod/v4';

export const DBEntrySchema = z.object({
	_id: z.string(),
	createdAt: z.string(),
	updatedAt: z.string().optional(),
	__v: z.number()
});

export const DuckInputSchema = z.object({
	name: z.string(),
	imgUrl: z.string(),
	quote: z.string()
});

export const DuckSchema = z.object({
	...DBEntrySchema.shape,
	...DuckInputSchema.shape
});

export const DuckSchemaArray = z.array(DuckSchema);

export const SignInResSchema = z.object({
	token: z.string(),
	user: z.object({
		userId: z.string()
	})
});

export const UserSchema = z.object({
	...DBEntrySchema.shape,
	firstName: z.string(),
	lastName: z.string(),
	email: z.email()
});
