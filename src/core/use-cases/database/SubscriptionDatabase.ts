import { Subscription } from "@/core/entities/Subscription";

export interface SubscriptionDatabase {
  save(subscription: Subscription): Promise<Subscription>;
  delete(subscription: Subscription): Promise<Subscription>;
  findAll(data: Subscription): Promise<Array<Subscription>>;
  findById(id: number): Promise<Subscription>;
  findByReferenceCode(referenceCode: string): Promise<Subscription>;
  findByIntegrationCode(integrationCode: string): Promise<Subscription>;
  findByIntegrationSessionCode(integrationSessionCode: string): Promise<Subscription>;
}
