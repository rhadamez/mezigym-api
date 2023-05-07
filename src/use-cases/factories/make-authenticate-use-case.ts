import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticationUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
	return new AuthenticationUseCase(new PrismaUsersRepository())
}