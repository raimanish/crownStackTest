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
                    product: {
                        productId: 1,
                    }
                },
                {
                    lineItemId: 2,
                    productId: 2,
                    orderId: 2,
                    quantity: 2,
                    amount: "10.00",
                    product: {
                        productId: 2,
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