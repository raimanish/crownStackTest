import "jest";

import { ProductHandler } from '../../../src/resources/Product/Product.handler';
import ProductValidator from '../../../src/resources/Product/Product.validator';
import { Product } from '../../../src/utility/db/models/product.model';

describe("Create Product",  () => {
    jest.mock('../../../src/resources/Product/Product.validator');
    jest.mock('../../../src/utility/db/models/product.model');

    const mockValidation = jest.fn();
    const mockCreate = jest.fn();

    ProductValidator.create.validate = mockValidation;
    Product.create = mockCreate;

    beforeEach(jest.clearAllMocks)

    it("should give error for required field", async() => {
        let body = { make: 1990 }
        let validateResult = {
            value: {  make: 1990 },
            error: {
                details: [
                    {
                      message: '"name" is required',
                      path: [ 'name' ],
                      type: 'any.required',
                      context: { label: 'name', key: 'name' }                
                    },

                    {
                        message: '"description" is required',
                        path: [ 'description' ],
                        type: 'any.required',
                        context: { label: 'description', key: 'description' }                
                    },

                    {
                        message: '"price" is required',
                        path: [ 'price' ],
                        type: 'any.required',
                        context: { label: 'price', key: 'price' }                
                    }
                ]  
            }
        }

        mockValidation.mockReturnValue(validateResult)
    const result = await ProductHandler.create(body);
    
    const actual= new Error('name is required, description is required, price is required');
    expect(mockValidation.mock.calls.length).toBe(1)
    expect(result).toMatchObject(actual);
    })


    it("should added product successfully", async() => {
        let body = { name:'test', description: 'test', prrice: 10.02,  make: 1990  }
        let validateResult = {
            value: { name:'test', description: 'test', prrice: 10.02,  make: 1990 },
        }
        let createProductResult = { productId: 1, name:'test', description: 'test', prrice: 10.02,  make: 1990 }

        mockValidation.mockReturnValue(validateResult)
        mockCreate.mockResolvedValueOnce(createProductResult)
    const result = await ProductHandler.create(body);
    
    const actual= { message: 'Product added successfully' };
    expect(result).toMatchObject(actual);
    expect(mockValidation.mock.calls.length).toBe(1);
    expect(mockCreate.mock.calls.length).toBe(1)
    })
    
    it("should throw error if product creation failed", async() => {
        let body = { name:'test', description: 'test', prrice: 10.02,  make: 1990  }
        let validateResult = {
            value: { name:'test', description: 'test', prrice: 10.02,  make: 1990 },
        }

        mockValidation.mockReturnValue(validateResult)
        mockCreate.mockRejectedValueOnce('Product creation failed')
        const response = await ProductHandler.create(body);
        expect(mockValidation.mock.calls.length).toBe(1);
        expect(mockCreate.mock.calls.length).toBe(1)
        expect(response).toEqual('Product creation failed')
    })

})