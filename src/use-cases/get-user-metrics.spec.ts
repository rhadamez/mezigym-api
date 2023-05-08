import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsRepositoryInMemory } from '@/repositories/in-memory/check-ins-repository-in-memory'
import { GetUserMetrics } from './get-user-metrics'

describe('Get User Metrics Use Case', () => {
	let checkInsRepository: CheckInsRepository
	let sut: GetUserMetrics

	beforeEach(async () => {
		checkInsRepository = new CheckInsRepositoryInMemory()
		sut = new GetUserMetrics(checkInsRepository)
	})

	it('should be able to get check ins count from metrics', async () => {
		await checkInsRepository.create({ gym_id: 'gym-01', user_id: 'user-01' })
		await checkInsRepository.create({ gym_id: 'gym-02', user_id: 'user-01' })

		const { checkInsCount } = await sut.execute({ userId: 'user-01' })

		expect(checkInsCount).toBe(2)
	})

})
