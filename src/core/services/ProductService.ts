import { Request, Response } from "express";
import { ProductDatabase } from "@/core/use-cases/database/ProductDatabase";
import { ProductPriceDatabase } from "@/core/use-cases/database/ProductPriceDatabase";
import { Authentication } from "@/core/models/Authentication";
import { PermissionRoleEnum } from "@/core/entities/Account";
import { Product } from "@/core/entities/Product";
import { ProductPrice } from "@/core/entities/ProductPrice";
import { PaymentSystem } from "@/core/use-cases/helpers/PaymentSystem";

export class ProductService {
  constructor(
    private readonly productRepository: ProductDatabase,
    private readonly productPriceRepository: ProductPriceDatabase,
    private readonly paymentSystem: PaymentSystem
  ) { }

  public async handleProductCreateRequest(request: Request, response: Response): Promise<any> {
    try {
      for (const property of ["name", "description", "amount", "currency", "type"]) {
        if (!request.body[property]) {
          return response.status(400).json({ status: false, message: "Param is Missing: " + property });
        }
      }
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ADMINISTRATOR, PermissionRoleEnum.ROOT].includes(authentication.account.role)) {
        const product = Product.createInstance(request.body);
        const productPrice = ProductPrice.createInstance(request.body);
        const productIntegrationResponse = await this.paymentSystem.createProduct(product);
        const priceIntegrationResponse = await this.paymentSystem.createPrice({ ...productPrice, productIntegrationCode: productIntegrationResponse.integrationCode });
        product.integrationCode = productIntegrationResponse.integrationCode;
        productPrice.integrationCode = priceIntegrationResponse.integrationCode;
        let productResponse = await this.productRepository.save(product);
        productPrice.product = productResponse;
        await this.productPriceRepository.save(productPrice);
        productResponse = await this.productRepository.findById(productResponse.id);
        response.status(201).json(productResponse.toDto());
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleFindAllProductRequest(request: Request, response: Response): Promise<any> {
    try {
      const product = Product.createInstance(request.query);
      const productResponse = await this.productRepository.findAll(product);
      response.status(200).json(productResponse.map(product => product.toDto()));
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleFindProductByIdRequest(request: Request, response: Response): Promise<any> {
    try {
      const productResponse = await this.productRepository.findById(Number(request.params.id));
      if (productResponse) {
        response.status(200).json(productResponse.toDto());
      } else {
        response.status(404).json({ status: false, message: "Product was not found." });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleDeleteProductRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ADMINISTRATOR, PermissionRoleEnum.ROOT].includes(authentication.account.role)) {
        let productResponse = await this.productRepository.findById(Number(request.params.id));
        if (productResponse) {
          await this.paymentSystem.deleteProduct(productResponse);
          productResponse = await this.productRepository.findById(Number(request.params.id));
          productResponse = await this.productRepository.delete(productResponse);
          response.status(204).json(productResponse.toDto());
        } else {
          response.status(404).json({ status: false, message: "Product was not found." });
        }
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleUpdateProductRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ROOT, PermissionRoleEnum.ADMINISTRATOR].includes(authentication.account.role)) {
        const productRequest = Product.createInstance(request.body);
        const currentProduct = await this.productRepository.findById(Number(request.params.id));
        if (productRequest.name) currentProduct.name = productRequest.name;
        if (productRequest.description) currentProduct.description = productRequest.description;
        if (productRequest.type) currentProduct.type = productRequest.type;
        await this.paymentSystem.updateProduct(currentProduct);
        const productSaveResponse = await this.productRepository.save(currentProduct);
        response.status(200).json(productSaveResponse.toDto());
      } else {
        response.status(403).json({ status: false, message: "You do not have the necessary permissions." });
      }
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleFindAllPriceRequest(request: Request, response: Response): Promise<any> {
    try {
      const productPriceResponse = await this.productRepository.findAll(Product.createInstance({ id: request.params.id }));
      response.status(200).json(productPriceResponse.map(product => product.prices).flat().map(price => price.toDto()));
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleCreatePriceRequest(request: Request, response: Response): Promise<any> {
    try {
      for (const property of ["amount", "currency"]) {
        if (!request.body[property]) {
          return response.status(400).json({ status: false, message: "Param is Missing: " + property });
        }
      }
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ROOT, PermissionRoleEnum.ADMINISTRATOR].includes(authentication.account.role)) {
        const product = await this.productRepository.findById(Number(request.params.id));
        const price = ProductPrice.createInstance(request.body);
        price.product = product;
        const integrationResponse = await this.paymentSystem.createPrice({ ...price, productIntegrationCode: product.integrationCode });
        price.integrationCode = integrationResponse.integrationCode;
        const productPriceResponse = await this.productPriceRepository.save(price);
        response.status(200).json(productPriceResponse.toDto());
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleFindPriceByIdRequest(request: Request, response: Response): Promise<any> {
    try {
      console.log(request.params);
      const productPrice = await this.productPriceRepository.findById(Number(request.params.priceId));
      response.status(200).json(productPrice.toDto());
    } catch (error) {
      console.log(error);
      response.status(500).json(error);
    }
  }

  public async handleUpdatePriceRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ROOT, PermissionRoleEnum.ADMINISTRATOR].includes(authentication.account.role)) {
        const productPrice = ProductPrice.createInstance(request.body);
        const [currentProduct, currentPrice] = await Promise.all([
          this.productRepository.findById(Number(request.params.id)),
          this.productPriceRepository.findById(Number(request.params.priceId))
        ]);
        if (productPrice.amount) currentPrice.amount = productPrice.amount;
        if (productPrice.currency) currentPrice.currency = productPrice.currency;
        const integrationResponse = await this.paymentSystem.updatePrice({ ...currentPrice, productIntegrationCode: currentProduct.integrationCode, priceIntegrationCode: currentPrice.integrationCode });
        currentPrice.integrationCode = integrationResponse.integrationCode;
        const productPriceResponse = await this.productPriceRepository.save(currentPrice);
        response.status(200).json(productPriceResponse.toDto());
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }

  public async handleDeletePriceRequest(request: Request, response: Response): Promise<any> {
    try {
      const authentication = new Authentication(request);
      if ([PermissionRoleEnum.ROOT, PermissionRoleEnum.ADMINISTRATOR].includes(authentication.account.role)) {
        let productPrice = await this.productPriceRepository.findById(Number(request.params.priceId));
        await this.paymentSystem.deletePrice({ priceIntegrationCode: productPrice.integrationCode });
        productPrice = await this.productPriceRepository.findById(Number(request.params.priceId));
        productPrice = await this.productPriceRepository.delete(productPrice);
        response.status(204).json(productPrice.toDto());
      } else {
        response.status(403).json({ status: false });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }
}
