import { describe, expect, test } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { UsersRepositoryInMemory } from '@/repositories/users-repository-in-memory'

describe('Register Use Case', () => {
	test('check if it workis', async () => {
		const prismaUserRepository = new UsersRepositoryInMemory()
		const registerUseCase = new RegisterUserCase(prismaUserRepository)

		const userInput = {
			name: 'rhadmaez',
			email: 'rhadamez@hotmail1.com',
			password: '123321'
		}

		const { user } = await registerUseCase.execute(userInput)

		const isPasswordCorrectlyHashed = await compare('123321', user.password_hash)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})
})
