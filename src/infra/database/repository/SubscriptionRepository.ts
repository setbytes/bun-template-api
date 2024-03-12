import { Repository } from "typeorm";
import { SubscriptionDatabase } from "@/core/use-cases/database/SubscriptionDatabase";
import { Subscription } from "@/core/entities/Subscription";

export class SubscriptionRepository implements SubscriptionDatabase {
  constructor(private readonly repository: Repository<Subscription>) {}

  public async save(subscription: Subscription): Promise<Subscription> {
    subscription.updatedAt = new Date();
    return this.repository.save(subscription);
  }

  public async delete(subscription: Subscription): Promise<Subscription> {
    subscription.deletedAt = new Date();
    // return this.subscriptionRepository.remove(subscription);
    return this.repository.save(subscription);
  }

  public async findById(id: number): Promise<Subscription> {
    return this.repository.findOne({ where: { id }, relations: ["account", "product"], cache: true });
  }

  public async findAll(data: Subscription): Promise<Array<Subscription>> {
    return this.repository.find({
      where: {
        id: data.id,
        account: { id: data.account.id },
        status: data.status
      },
      relations: ["product"]
    });
  }

  public async findByReferenceCode(referenceCode: string): Promise<Subscription> {
    return this.repository.findOne({ where: { referenceCode } });
  }

  public async findByIntegrationCode(integrationCode: string): Promise<Subscription> {
    return this.repository.findOne({ where: { integrationCode } });
  }

  public async findByIntegrationSessionCode(integrationSessionCode: string): Promise<Subscription> {
    return this.repository.findOne({ where: { integrationSessionCode } });
  }
}
