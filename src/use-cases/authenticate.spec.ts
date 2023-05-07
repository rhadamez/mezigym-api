import { beforeEach, describe, expect, test } from 'vitest'
import { hash } from 'bcryptjs'
import { UsersRepositoryInMemory } from '@/repositories/in-memory/users-repository-in-memory'
import { AuthenticationUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
	let usersRepository: UsersRepositoryInMemory
	let sut: AuthenticationUseCase

	beforeEach(() => {
		usersRepository = new UsersRepositoryInMemory()
		sut = new AuthenticationUseCase(usersRepository)
	})

	test('should be able to authenticate', async () => {
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
		await expect(sut.execute({
			email: 'rhadamez@gmail.com',
			password: '123321'
		})).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	test('should not be able to authenticate with wrong password', async () => {
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
