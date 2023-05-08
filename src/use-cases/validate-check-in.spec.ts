import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsRepositoryInMemory } from '@/repositories/in-memory/check-ins-repository-in-memory'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFound } from './errors/resource-not-found'

describe('Validate Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: ValidateCheckInUseCase

	beforeEach(async () => {
		checkInsRepository = new CheckInsRepositoryInMemory()
		sut = new ValidateCheckInUseCase(checkInsRepository)
	})

	it('should be able to validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({ gym_id: 'gym-01', user_id: 'user-01' })

		const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate a non existing check-in', async () => {
		await expect(sut.execute({ checkInId: 'check-in-id' })).rejects.toBeInstanceOf(ResourceNotFound)
	})

	it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2023, 4, 7, 22, 49))

		const createdCheckIn = await checkInsRepository.create({ gym_id: 'gym-01', user_id: 'user-01' })

		vi.setSystemTime(new Date(2023, 4, 7, 23, 15))

		await expect(() => sut.execute({ checkInId: createdCheckIn.id })).rejects.toBeInstanceOf(Error)
	})

})
