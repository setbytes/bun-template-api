import * as uuid from "uuid";
import { UniqueIdentifier } from "@/core/use-cases/helpers/UniversallyUniqueIdentifier";

export class UniqueCode implements UniqueIdentifier {
  public generate(): string {
    return uuid.v4();
  }
}
