import { Repository } from "typeorm";
import { Listener } from "@/core/entities/Listener";
import { ListenerDatabase } from "@/core/use-cases/database/ListenerDatabase";

export class ListenerRepository implements ListenerDatabase {
  constructor(private readonly repository: Repository<Listener>) {}

  public async save(data: Listener): Promise<Listener> {
    data.updatedAt = new Date();
    return this.repository.save(data);
  }

  public async delete(data: Listener): Promise<Listener> {
    data.deletedAt = new Date();
    // return this.webhookRepository.remove(data);
    return this.repository.save(data);
  }

  public async findById(id: number): Promise<Listener> {
    return this.repository.findOne({ where: { id }, relations: ["account", "credential"] });
  }

  public async findAll(data: Listener): Promise<Array<Listener>> {
    return this.repository.find({ where: { account: { id: data.account.id } }, relations: ["account", "credential"] });
  }

  public async findByReferenceCode(referenceCode: string): Promise<Listener> {
    return this.repository.findOne({ where: { referenceCode } });
  }
}
