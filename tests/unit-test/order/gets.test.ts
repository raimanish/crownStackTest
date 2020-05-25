import "jest";

import { OrderHandler } from '../../../src/resources/Order/Order.handler';

import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';


describe("Gets Order",  () => {

    const mockIncompleteOrder = jest.fn();
    const mockSequlizeConnection = jest.fn()
    
    SequlizeConnection.sequelize = jest.fn()
    SequlizeConnection.sequelize.transaction = jest.fn();

   
    OrderHandler.inCompleteOrder = mockIncompleteOrder;
   
    beforeEach(jest.clearAllMocks)



    it("should give success message", async() => {

        let order = { 
            orderId: 2, total: 10, status: 1,
            lineItem: [
                {
                    lineItemId: 1,
                    productId: 1,
                    orderId: 2,
                    quantity: 4,
                    amount: 40.08,
                    createdAt: "2020-05-21T12:02:29.030Z",
                    updatedAt: "2020-05-21T12:03:03.215Z",
                    product: {
                        productId: 1,
                        name: "Tea",
                        description: "Best taste tea",
                        make: 1990,
                        price: 10.02,
                        active: true,
                        createdAt: 
                        "2020-05-20T19:57:32.787Z",
                        updatedAt: "2020-05-20T19:57:32.787Z"
                    }
                },
                {
                    lineItemId: 2,
                    productId: 2,
                    orderId: 2,
                    quantity: 2,
                    amount: "10.00",
                    createdAt: "2020-05-21T12:03:23.503Z",
                    updatedAt: "2020-05-21T12:03:23.503Z",
                    product: {
                        productId: 2,
                        name: "Tea Cup",
                        description: "nice shape",
                        make: 2020,
                        price: 5.00,
                        active: true,
                        createdAt: "2020-05-20T20:03:20.728Z",
                        updatedAt: "2020-05-20T20:03:20.728Z"
                    }
                }
            ]
        }

        mockIncompleteOrder.mockReturnValueOnce(order); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.gets(1);
        
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(result.items[0].lineItemId).toBe(1)
        expect(result.items.length).toBe(2)
    })

    it("should return empty array of items", async() => {

        mockIncompleteOrder.mockReturnValueOnce(null); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.gets(1);
        
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(result.items.length).toBe(0)
    })

    it("should return exception message if incomplete orders fails", async() => {

        mockIncompleteOrder.mockRejectedValueOnce('Incomplete order failed'); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.gets(1);
        
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(result).toEqual('Incomplete order failed')
    })
})