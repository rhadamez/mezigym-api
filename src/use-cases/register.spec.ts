import { beforeEach, describe, expect, test } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { UsersRepositoryInMemory } from '@/repositories/in-memory/users-repository-in-memory'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
	let usersRepository: UsersRepositoryInMemory
	let sut: RegisterUserCase

	beforeEach(() => {
		usersRepository = new UsersRepositoryInMemory()
		sut = new RegisterUserCase(usersRepository)
	})

	test('should be able to register', async () => {
		const userInput = {
			name: 'rhadmaez',
			email: 'rhadamez@hotmail1.com',
			password: '123321'
		}

		const { user } = await sut.execute(userInput)

		expect(user.id).toEqual(expect.any(String))
	})

	test('check if it password hash works', async () => {
		const userInput = {
			name: 'rhadmaez',
			email: 'rhadamez@hotmail1.com',
			password: '123321'
		}

		const { user } = await sut.execute(userInput)

		const isPasswordCorrectlyHashed = await compare('123321', user.password_hash)

		expect(isPasswordCorrectlyHashed).toBe(true)
	})

	test('should not be able to register with same email twice', async () => {
		const userInput = {
			name: 'rhadmaez',
			email: 'rhadamez@hotmail1.com',
			password: '123321'
		}

		await sut.execute(userInput)

		await expect(() => sut.execute(userInput)).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
