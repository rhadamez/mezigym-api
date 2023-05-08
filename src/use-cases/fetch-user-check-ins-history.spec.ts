import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsRepositoryInMemory } from '@/repositories/in-memory/check-ins-repository-in-memory'
import { FetchUserCheckInsHistory } from './fetch-user-check-ins-history'

describe('Fetch Check In Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: FetchUserCheckInsHistory

	beforeEach(async () => {
		checkInsRepository = new CheckInsRepositoryInMemory()
		sut = new FetchUserCheckInsHistory(checkInsRepository)
	})

	it('should be able to fetch check-in history', async () => {
		await checkInsRepository.create({ gym_id: 'gym-01', user_id: 'user-01' })
		await checkInsRepository.create({ gym_id: 'gym-02', user_id: 'user-01' })

		const { checkIn } = await sut.execute({ userId: 'user-01', page: 1 })

		expect(checkIn).toHaveLength(2)
		expect(checkIn).toEqual([
			expect.objectContaining({ gym_id: 'gym-01'}),
			expect.objectContaining({ gym_id: 'gym-02'})
		])
	})

	it('should be able to fetch paginated check-in history', async () => {
		for(let i = 1; i <= 22; i++) {
			await checkInsRepository.create({ gym_id: `gym-${i}`, user_id: 'user-01' })
		}

		const { checkIn } = await sut.execute({ userId: 'user-01', page: 2 })

		expect(checkIn).toHaveLength(2)
		expect(checkIn).toEqual([
			expect.objectContaining({ gym_id: 'gym-21'}),
			expect.objectContaining({ gym_id: 'gym-22'})
		])
	})
})
