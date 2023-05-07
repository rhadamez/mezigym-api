import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from './errors/resource-not-found'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
	userLatitude: number
	userLongitude: number
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn
}

export class CheckinUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymRepository: GymsRepository
	) { }

	async execute({ userId, gymId, userLatitude, userLongitude }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
		const gym = await this.gymRepository.findById(gymId)
		if(!gym) throw new ResourceNotFound('Gym not found')

		const checkOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())
		if(checkOnSameDay) throw new Error()

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		})

		return { checkIn }
	}
}