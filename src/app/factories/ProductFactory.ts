import { DatabaseFactory } from "@/app/factories/DatabaseFactory";
import { ProductService } from "@/core/services/ProductService";
import { StripePayment } from "@/infra/payments/StripePayment";

export class ProductFactory {
  public static createProductService(): ProductService {
    const productRepository = DatabaseFactory.createProductRepository();
    const productPriceRepository = DatabaseFactory.createProductPriceRepository();
    const stripePayment = new StripePayment();
    return new ProductService(productRepository, productPriceRepository, stripePayment);
  }
}
