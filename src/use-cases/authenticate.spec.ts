import { describe, expect, test } from 'vitest'
import { hash } from 'bcryptjs'
import { UsersRepositoryInMemory } from '@/repositories/in-memory/users-repository-in-memory'
import { AuthenticationUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
	test('should be able to authenticate', async () => {
		const usersRepository = new UsersRepositoryInMemory()
		const sut = new AuthenticationUseCase(usersRepository)

		await usersRepository.create({
			name: 'Rhadamez',
			email: 'rhadamez@gmail.com',
			password_hash: await hash('123321', 6)
		})

		const { user } = await sut.execute({
			email: 'rhadamez@gmail.com',
			password: '123321'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	test('should not be able to authenticate with wrong email', async () => {
		const usersRepository = new UsersRepositoryInMemory()
		const sut = new AuthenticationUseCase(usersRepository)

		await expect(sut.execute({
			email: 'rhadamez@gmail.com',
			password: '123321'
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	test('should not be able to authenticate with wrong password', async () => {
		const usersRepository = new UsersRepositoryInMemory()
		const sut = new AuthenticationUseCase(usersRepository)

		await usersRepository.create({
			name: 'Rhadamez',
			email: 'rhadamez@gmail.com',
			password_hash: await hash('123321', 6)
		})

		await expect(sut.execute({
			email: 'rhadamez@gmail.com',
			password: '123123'
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
