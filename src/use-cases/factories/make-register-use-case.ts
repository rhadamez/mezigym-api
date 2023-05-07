import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register'

export function makeRegisterUseCase(): RegisterUserCase {
	return new RegisterUserCase(new PrismaUsersRepository())
}