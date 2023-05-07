import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

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

	async findById(id: string): Promise<Gym | null> {
		const gym = this.gyms.find(gym => gym.id === id)
		if(!gym) return null

		return gym
	}
}