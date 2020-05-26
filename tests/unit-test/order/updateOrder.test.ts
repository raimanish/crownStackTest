import "jest";

import { OrderHandler } from '../../../src/resources/Order/Order.handler';
import { Order } from '../../../src/utility/db/models/order.model';
import { LineItem } from "../../../src/utility/db/models/lineItem.model";

describe("Update Order",  () => {
    jest.mock('../../../src/resources/Order/Order.validator');
    jest.mock('../../../src/utility/db/models/order.model');

    const mockCreateLineItem = jest.fn();
    const mockItemUpdateOne = jest.fn();
    const mockOrderUpdate = jest.fn();


    LineItem.create = mockCreateLineItem;
    LineItem.update = mockItemUpdateOne;
    Order.update = mockOrderUpdate;

    beforeEach(jest.clearAllMocks)

    // Data
    let order = { orderId: 2, total: 10, status: 1, lineItem:[] }

    let lineItem = { lineItemId: 1, productId: 1, quantity: 1, amount: 20 }

    let product = { productId: 1, price: 20 }

    let value = { productId: 1, quantity: 1}

    it("lineitem should be created if action is create", async() => {

        await OrderHandler.updateOrder(value, 'Create', order, [], product)

        mockCreateLineItem.mockReturnValueOnce(lineItem);
        expect(mockItemUpdateOne.mock.calls.length).toBe(0)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockCreateLineItem.mock.calls.length).toBe(1)
    })

    it("line item should be updated if action is update", async() => {
        await OrderHandler.updateOrder(value, 'Update', order, [lineItem], product)

        expect(mockItemUpdateOne.mock.calls.length).toBe(1)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockCreateLineItem.mock.calls.length).toBe(0)
    })

    it("line item should not be created or updated when action is not create or update", async() => {
        await OrderHandler.updateOrder(value, 'Delete', order, [lineItem], product)

        expect(mockItemUpdateOne.mock.calls.length).toBe(0)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockCreateLineItem.mock.calls.length).toBe(0)

    })

  

    it("should throw error when line item updation fails", async() => {

        mockItemUpdateOne.mockRejectedValueOnce('Line Item updation failed')

        const response = await OrderHandler.updateOrder(value, 'Update', order, [lineItem], product)

        expect(mockItemUpdateOne.mock.calls.length).toBe(1)
        expect(mockOrderUpdate.mock.calls.length).toBe(0)
        expect(mockCreateLineItem.mock.calls.length).toBe(0)  
        expect(response).toEqual('Line Item updation failed')
     
    })

    it("should throw error when order updation fails", async() => {        

        mockOrderUpdate.mockRejectedValueOnce('Order updation failed')

        const response = await OrderHandler.updateOrder(value, 'Update', order, [lineItem], product)
        expect(mockItemUpdateOne.mock.calls.length).toBe(1)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockCreateLineItem.mock.calls.length).toBe(0)
        expect(response).toEqual('Order updation failed')

    })
})