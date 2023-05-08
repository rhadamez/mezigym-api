import { beforeEach, describe, expect, it } from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { GymInMemory } from '@/repositories/in-memory/gym-in-memory'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('Fetch Nearby Gyms Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: FetchNearbyGymsUseCase

	beforeEach(async () => {
		gymsRepository = new GymInMemory()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'near-gym 1',
			description: 'gym-name',
			phone: 'gym-phone',
			latitude: -29.668524,
			longitude: -51.0845768
		})

		await gymsRepository.create({
			title: 'near-gym 2',
			description: 'gym-name',
			phone: 'gym-phone',
			latitude: -29.6641237,
			longitude: -51.0704147
		})

		await gymsRepository.create({
			title: 'far-gym',
			description: null,
			phone: null,
			latitude: -29.2929641,
			longitude: -51.3801077
		})

		const { gyms } = await sut.execute({ userLatitude: -29.6878007, userLongitude: -51.0853921 })

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'near-gym 1'}),
			expect.objectContaining({ title: 'near-gym 2'}),
		])
	})

})
