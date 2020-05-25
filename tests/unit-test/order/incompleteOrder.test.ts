import "jest";
import { Order } from '../../../src/utility/db/models/order.model';
import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';
import { OrderHandler } from '../../../src/resources/Order/Order.handler';


describe("Gets Order",  () => {

    const mockOrderFindOne = jest.fn();
    const mockSequlizeConnection = jest.fn()
    
    SequlizeConnection.sequelize = jest.fn()
    SequlizeConnection.sequelize.transaction = jest.fn();

   
    Order.findOne = mockOrderFindOne;
   
    beforeEach(jest.clearAllMocks)



    it("should return order", async() => {

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

        mockOrderFindOne.mockReturnValueOnce(order); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.inCompleteOrder(1);
        
        expect(mockOrderFindOne.mock.calls.length).toBe(1)
        expect(result!.lineItem[0].lineItemId).toBe(1)
        expect(result!.lineItem.length).toBe(2)
    })

    it("should return null", async() => {

        mockOrderFindOne.mockReturnValueOnce(null); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.inCompleteOrder(1);
        
        expect(mockOrderFindOne.mock.calls.length).toBe(1)
        expect(result).toBe(null)
    })

    it("should return exception message if incomplete orders fails", async() => {

        mockOrderFindOne.mockRejectedValueOnce('Error in find one'); 
        mockSequlizeConnection.mockResolvedValueOnce('test')
        
        const result = await OrderHandler.inCompleteOrder(1);
        
        expect(mockOrderFindOne.mock.calls.length).toBe(1)
        expect(result).toEqual('Error in find one');
    })
})