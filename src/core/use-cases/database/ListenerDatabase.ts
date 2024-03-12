import { Listener } from "@/core/entities/Listener";

export interface ListenerDatabase {
  save(listener: Listener): Promise<Listener>;
  delete(listener: Listener): Promise<Listener>;
  findAll(listener: Listener): Promise<Array<Listener>>;
  findById(id: number): Promise<Listener>;
  findByReferenceCode(referenceCode: string): Promise<Listener>;
}
