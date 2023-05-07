import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
	const registerBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6)
	})

	const { email, password } = registerBodySchema.parse(req.body)

	try {
		const registerUserCase = makeAuthenticateUseCase()
		await registerUserCase.execute({  email, password })
	} catch(err) {
		if(err instanceof InvalidCredentialsError) {
			return rep.status(400).send({ message: err.message })
		}

		throw err
	}

	return rep.status(200).send()
}