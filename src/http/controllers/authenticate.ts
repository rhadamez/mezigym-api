import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticationUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
	const registerBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { email, password } = registerBodySchema.parse(req.body)

	try {
		const registerUserCase = new AuthenticationUseCase(new PrismaUsersRepository())
		await registerUserCase.execute({  email, password })
	} catch(err) {
		if(err instanceof InvalidCredentialsError) {
			return rep.status(400).send({ message: err.message })
		}

		throw err
	}

	return rep.status(200).send()
}