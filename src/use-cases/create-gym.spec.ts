import { beforeEach, describe, expect, test } from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { GymInMemory } from '@/repositories/in-memory/gym-in-memory'
import { CreateGymUseCase } from './create-gym'

describe('Create Gym Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: CreateGymUseCase

	beforeEach(() => {
		gymsRepository = new GymInMemory()
		sut = new CreateGymUseCase(gymsRepository)
	})

	test('should be able to create gym', async () => {
		const { gym } = await sut.execute({
			title: 'gym-01',
			description: 'gym-name',
			phone: 'gym-phone',
			latitude: -29.6878007,
			longitude: -51.0853921
		})

		expect(gym.id).toEqual(expect.any(String))
	})

})
