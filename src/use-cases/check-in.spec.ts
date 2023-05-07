import { beforeEach, describe, expect, test } from 'vitest'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckinUseCase } from './check-in'
import { checkInsRepositoryInMemory } from '@/repositories/in-memory/check-ins-repository-in-memory'

describe('Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: CheckinUseCase

	beforeEach(() => {
		checkInsRepository = new checkInsRepositoryInMemory()
		sut = new CheckinUseCase(checkInsRepository)
	})

	test('should be able to get user profile', async () => {
		const userInput = {
			gymId: 'gyn-01',
			userId: 'user-01'
		}

		const { checkIn } = await sut.execute(userInput)

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
