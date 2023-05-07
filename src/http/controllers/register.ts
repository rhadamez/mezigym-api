import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUserCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(req: FastifyRequest, rep: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { name, email, password } = registerBodySchema.parse(req.body)

	try {
		const registerUserCase = new RegisterUserCase(new PrismaUsersRepository())
		await registerUserCase.execute({ name, email, password })
	} catch(err) {
		if(err instanceof UserAlreadyExistsError) {
			return rep.status(409).send({ message: err.message })
		}

		throw err
	}

	return rep.status(201).send()
}