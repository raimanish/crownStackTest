import "jest";

import { OrderHandler } from '../../../src/resources/Order/Order.handler';
import OrderValidator from '../../../src/resources/Order/Order.validator';
import { Order } from '../../../src/utility/db/models/order.model';
import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';
import { LineItem } from "../../../src/utility/db/models/lineItem.model";
import { Product } from "../../../src/utility/db/models/product.model";

describe("Create Order",  () => {
    jest.mock('../../../src/resources/Order/Order.validator');
    jest.mock('../../../src/utility/db/models/order.model');

    const mockValidation = jest.fn();
    const mockCreateOrder = jest.fn();
    const mockIncompleteOrder = jest.fn();
    const mockSequlizeConnection = jest.fn()
    const mockCreateLineItem = jest.fn();
    const mockProductFindOne = jest.fn();
    const mockItemUpdateOne = jest.fn();
    const mockOrderUpdate = jest.fn();

    SequlizeConnection.sequelize = jest.fn()
    SequlizeConnection.sequelize.transaction = jest.fn();

    OrderValidator.create.validate = mockValidation;
    Order.create = mockCreateOrder;
    OrderHandler.inCompleteOrder = mockIncompleteOrder;
    LineItem.create = mockCreateLineItem;
    Product.findOne = mockProductFindOne;
    LineItem.update = mockItemUpdateOne;
    Order.update = mockOrderUpdate;
    beforeEach(jest.clearAllMocks)

    it("should give error for required field", async() => {
        let body = {  }
        let validateResult = {
            value: { },
            error: {
                details: [
                    {
                      message: '"product" is required',
                      path: [ 'product' ],
                      type: 'any.required',
                      context: { label: 'product', key: 'product' }                
                    },

                    {
                        message: '"quantity" is required',
                        path: [ 'quantity' ],
                        type: 'any.required',
                        context: { label: 'quantity', key: 'quantity' }                
                    },
                ]  
            }
        }

        mockValidation.mockReturnValue(validateResult)
        const result = await OrderHandler.create(body, 1);
        
        const actual= new Error('product is required, quantity is required');
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
    })


    it("should give success message if incomplete order does not exist", async() => {
        let body = { productId: 1, quantity: 1 }
        let validateResult = {
            value: { productId: 1, quantity: 1 },
        }

        let order = { orderId: 2, total: 10, status: 1, lineItem:[] }

        let lineItem = { lineItemId: 1, productId: 1, quantity: 1, amount: 20 }

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(null);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockCreateOrder.mockReturnValueOnce(order);
        mockCreateLineItem.mockReturnValueOnce(lineItem);
        const result = await OrderHandler.create(body, 1);
        
        const actual= { message: 'Item added successfully to cart' };
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(mockCreateOrder.mock.calls.length).toBe(1)
        expect(mockCreateLineItem.mock.calls.length).toBe(1)
        
    })

    it("should give success message if incomplete order exist with line item", async() => {
        let body = { productId: 1, quantity: 1 }
        let validateResult = {
            value: { productId: 1, quantity: 1 },
        }

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

        let lineItem = { lineItemId: 2, productId: 1, quantity: 1, amount: 20 }

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue({ productId: 2, price: 20 });
        mockCreateOrder.mockReturnValueOnce(order);
        mockItemUpdateOne.mockReturnValueOnce(lineItem);
        mockOrderUpdate.mockResolvedValue(order);
        const result = await OrderHandler.create(body, 1);
        
        const actual= { message: 'Item added successfully to cart' };
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockItemUpdateOne.mock.calls.length).toBe(1)
        


    })

    it("should give success message if incomplete order exist with line item but line item does not match", async() => {
        let body = { productId: 2, quantity: 1 }
        let validateResult = {
            value: { productId: 2, quantity: 1 },
        }

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
                }
            ]
        }

        let lineItem = { lineItemId: 2, productId: 1, quantity: 1, amount: 20 }

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue({ productId: 2, price: 20 });
        mockCreateOrder.mockReturnValueOnce(order);
        mockCreateLineItem.mockReturnValueOnce(lineItem);
        const result = await OrderHandler.create(body, 1);
        
        const actual= { message: 'Item added successfully to cart' };
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockCreateLineItem.mock.calls.length).toBe(1)
        expect(mockItemUpdateOne.mock.calls.length).toBe(0)
    })

    it("should give success message if incomplete order exist with line item and line item matches", async() => {
        let body = { productId: 1, quantity: 1 }
        let validateResult = {
            value: { productId: 1, quantity: 1 },
        }

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

        let lineItem = { lineItemId: 2, productId: 1, quantity: 1, amount: 20 }

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue({ productId: 2, price: 20 });
        mockCreateOrder.mockReturnValueOnce(order);
        mockItemUpdateOne.mockReturnValueOnce(lineItem);
        mockOrderUpdate.mockResolvedValue(order);
        const result = await OrderHandler.create(body, 1);
        
        const actual= { message: 'Item added successfully to cart' };
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(1)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockOrderUpdate.mock.calls.length).toBe(1)
        expect(mockItemUpdateOne.mock.calls.length).toBe(1)
    })
})