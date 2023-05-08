import { beforeEach, describe, expect, it } from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { SearchGymsUseCase } from './search-gyms'
import { GymInMemory } from '@/repositories/in-memory/gym-in-memory'

describe('Search Gym Use Case', () => {
	let gymsRepository: GymsRepository
	let sut: SearchGymsUseCase

	beforeEach(async () => {
		gymsRepository = new GymInMemory()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'gym-01',
			description: 'gym-name',
			phone: 'gym-phone',
			latitude: -29.6878007,
			longitude: -51.0853921
		})

		await gymsRepository.create({
			title: 'gym-02',
			description: null,
			phone: null,
			latitude: -29.6878007,
			longitude: -51.0853921
		})

		const { gyms } = await sut.execute({ query: 'gym-01', page: 1 })

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'gym-01'}),
		])
	})

	it('should be able to fetch paginate gyms search', async () => {
		for(let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `Javascript Gym ${i}`,
				description: null,
				phone: null,
				latitude: -29.6878007,
				longitude: -51.0853921
			})
		}

		const { gyms } = await sut.execute({ query: 'Javascript', page: 2 })

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Javascript Gym 21'}),
			expect.objectContaining({ title: 'Javascript Gym 22'}),
		])
	})
})
