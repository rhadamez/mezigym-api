import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class GymInMemory implements GymsRepository {

	private gyms: Gym[] = []

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym = {
			id: this.gyms.length+1+'',
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
			created_at: new Date()
		}

		this.gyms.push(gym)

		return gym
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.gyms
			.filter(checkIn => checkIn.title.includes(query))
			.slice((page - 1) * 20, page * 20)
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.gyms.find(gym => gym.id === id)
		if(!gym) return null

		return gym
	}

	async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		return this.gyms.filter(item => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{ latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
			)

			return distance < 10
		})
	}
}