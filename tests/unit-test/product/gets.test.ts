import "jest";

import { ProductHandler } from '../../../src/resources/Product/Product.handler';
import { Product } from '../../../src/utility/db/models/product.model';

describe("Get Products",  () => {
    jest.mock('../../../src/utility/db/models/product.model');

    const mockCount = jest.fn();
    const mockFindAll = jest.fn();

    Product.findAll = mockFindAll;
    Product.count = mockCount;
    beforeEach(jest.clearAllMocks)

    it("should give products and total if page and per page not passed", async() => {
        let validateResult = [
            { 
                productId: 1, name: 'test', description: 'test', price: 10.32
            }, {
                productId: 2, name: 'test_1', description: 'test_2', price: 10.00
            }
        ]

        mockFindAll.mockReturnValue(validateResult)
        mockCount.mockResolvedValueOnce(2);
        const result = await ProductHandler.gets();
    
    expect(result.products.length).toBe(2);
    expect(result.products[0].productId).toBe(1)
    expect(result.total).toBe(2)
    })


    it("should give products and total if page and per page passed", async() => {
        let validateResult = [
            { 
                productId: 1, name: 'test', description: 'test', price: 10.32
            }, {
                productId: 2, name: 'test_1', description: 'test_2', price: 10.00
            }
        ]

        mockFindAll.mockReturnValue(validateResult)
        mockCount.mockResolvedValueOnce(2);
        const result = await ProductHandler.gets('15','2');
    
    expect(result.products.length).toBe(2);
    expect(result.products[0].productId).toBe(1)
    expect(result.total).toBe(2)
    })

    it("should give exception if find All query fails", async() => {
        mockFindAll.mockRejectedValue('Error occured')
        const result = await ProductHandler.gets('10','1');
    
        const actual= 'Error occured';
        expect(result).toEqual(actual);    
    })

    it("should give products and total", async() => {
        let validateResult = [
            { 
                productId: 1, name: 'test', description: 'test', price: 10.32
            }, {
                productId: 2, name: 'test_1', description: 'test_2', price: 10.00
            }
        ]

        mockFindAll.mockReturnValue(validateResult)
        mockCount.mockRejectedValue('Error in fecthing count');
        const result = await ProductHandler.gets('10','2');
    
        const actual= 'Error in fecthing count';
        expect(result).toEqual(actual); 
    })
})