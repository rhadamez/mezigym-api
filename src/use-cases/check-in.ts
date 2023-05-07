import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins'

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

		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
		)

		const MAX_DISTANCE_IN_KILOMETERS = 0.1

		if(distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError()

		const checkOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())
		if(checkOnSameDay) throw new MaxNumberOfCheckInsError()

		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		})

		return { checkIn }
	}
}