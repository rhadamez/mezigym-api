import { beforeEach, describe, expect, test } from 'vitest'
import { UsersRepositoryInMemory } from '@/repositories/in-memory/users-repository-in-memory'
import { GetUserProfileUseCase } from './get-user-profile'

describe('Register Use Case', () => {
	let usersRepository: UsersRepositoryInMemory
	let sut: GetUserProfileUseCase

	beforeEach(() => {
		usersRepository = new UsersRepositoryInMemory()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	test('should be able to get user profile', async () => {
		await usersRepository.create({
			name: 'Rhadamez',
			email: 'rhadamez@gmail.com',
			password_hash: '123321'
		})

		const userInput = {
			userId: '1'
		}

		const { user } = await sut.execute(userInput)

		expect(user.id).toEqual(expect.any(String))
		expect(user.name).toEqual('Rhadamez')
	})

})
