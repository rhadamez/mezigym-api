import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckinUseCase } from './check-in'
import { checkInsRepositoryInMemory } from '@/repositories/in-memory/check-ins-repository-in-memory'
import { GymsRepository } from '@/repositories/gyms-repository'
import { GymInMemory } from '@/repositories/in-memory/gym-in-memory'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'

describe('Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let gymsRepository: GymsRepository
	let sut: CheckinUseCase

	beforeEach(async () => {
		checkInsRepository = new checkInsRepositoryInMemory()
		gymsRepository = new GymInMemory()
		sut = new CheckinUseCase(checkInsRepository, gymsRepository)

		await gymsRepository.create({
			title: 'gym-01',
			description: 'gym-name',
			phone: 'gym-phone',
			latitude: -29.6878007,
			longitude: -51.0853921
		})

		vi.useFakeTimers()
	})

	afterAll(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const userInput = {
			gymId: '1',
			userId: 'user-01',
			userLatitude: -29.6878007,
			userLongitude: -51.0853921
		}

		const { checkIn } = await sut.execute(userInput)

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		const userInput = {
			gymId: '1',
			userId: 'user-01',
			userLatitude: -29.4886291,
			userLongitude: -50.9696451
		}

		await expect(sut.execute(userInput)).rejects.toBeInstanceOf(MaxDistanceError)
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		const userInput = {
			gymId: '1',
			userId: 'user-01',
			userLatitude: -29.6878007,
			userLongitude: -51.0853921
		}

		await sut.execute(userInput)

		await expect(() => sut.execute(userInput)).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

		const userInput = {
			gymId: '1',
			userId: 'user-01',
			userLatitude: -29.6878007,
			userLongitude: -51.0853921
		}

		console.log(await sut.execute(userInput))

		vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

		const { checkIn } = await sut.execute(userInput)

		console.log(checkIn)

		expect(checkIn.id).toEqual(expect.any(String))
	})
})
