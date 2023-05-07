import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

export class GymInMemory implements GymsRepository {
	private gyms: Gym[] = []

	async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
		const gym: Gym = {
			id: this.gyms.length+1+'',
			title: data.title,
			description: 'data.description',
			phone: 'data.phone',
			latitude: new Decimal(0),
			longitude: new Decimal(0)
		}
		this.gyms.push(gym)

		return gym
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.gyms.find(gym => gym.id === id)
		if(!gym) return null

		return gym
	}
}