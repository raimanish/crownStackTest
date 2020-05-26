import "jest";

import { OrderHandler } from '../../../src/resources/Order/Order.handler';
import OrderValidator from '../../../src/resources/Order/Order.validator';
import { Order } from '../../../src/utility/db/models/order.model';
import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';
import { Product } from "../../../src/utility/db/models/product.model";


describe("Create Order",  () => {
    jest.mock('../../../src/resources/Order/Order.validator');
    jest.mock('../../../src/utility/db/models/order.model');

    const mockValidation = jest.fn();
    const mockCreateOrder = jest.fn();
    const mockIncompleteOrder = jest.fn();
    const mockSequlizeConnection = jest.fn()
    const mockProductFindOne = jest.fn();
    const mockUpdateOrder = jest.fn();

    SequlizeConnection.sequelize = jest.fn()
    SequlizeConnection.sequelize.transaction = jest.fn();

    OrderValidator.create.validate = mockValidation;
    Order.create = mockCreateOrder;
    Product.findOne = mockProductFindOne;
    OrderHandler.inCompleteOrder = mockIncompleteOrder;
    OrderHandler.updateOrder =  mockUpdateOrder;
    beforeEach(jest.clearAllMocks)

    const product = { productId: 2, price: 20 }

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
        expect(mockProductFindOne.mock.calls.length).toBe(0)
        expect(mockIncompleteOrder.mock.calls.length).toBe(0)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
    })


    it("should create order and give success message if incomplete order does not exist", async() => {
        let body = { productId: 1, quantity: 1 }
        let validateResult = {
            value: { productId: 1, quantity: 1 },
        }

        let product = { productId: 1, price: 10 }

        let order = { orderId: 2, total: 10, status: 1, lineItem:[] }

        mockValidation.mockReturnValue(validateResult)
        mockProductFindOne.mockResolvedValueOnce(product)
        mockIncompleteOrder.mockReturnValueOnce(null).mockReturnValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockCreateOrder.mockReturnValueOnce(order);
        const result = await OrderHandler.create(body, 1);
        
        const actual= 'Item added successfully to cart';
        expect(result.message).toEqual(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(2)
        expect(mockCreateOrder.mock.calls.length).toBe(1)
        expect(mockUpdateOrder.mock.calls.length).toBe(1)
        expect(mockProductFindOne.mock.calls.length).toBe(1)
        expect(result.order.orderId).toEqual(2);
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

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order).mockResolvedValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue({ productId: 2, price: 20 });
        mockCreateOrder.mockReturnValueOnce(order);
        const result = await OrderHandler.create(body, 1);
        
        const actual= 'Item added successfully to cart';
        expect(result.message).toEqual(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(2)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockUpdateOrder.mock.calls.length).toBe(1);
        expect(result.order.orderId).toEqual(2);
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
                    product: {
                        productId: 1,
                    }
                }
            ]
        }

        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order).mockReturnValueOnce(order);;
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue(product);
        mockCreateOrder.mockReturnValueOnce(order)
        const result = await OrderHandler.create(body, 1);
        
        const actual= 'Item added successfully to cart';
        expect(result.message).toEqual(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(2)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockUpdateOrder.mock.calls.length).toBe(1)
        expect(result.order.orderId).toEqual(2);


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


        mockValidation.mockReturnValue(validateResult)
        mockIncompleteOrder.mockReturnValueOnce(order).mockReturnValueOnce(order);
        mockSequlizeConnection.mockResolvedValueOnce('test')
        mockProductFindOne.mockResolvedValue({ productId: 2, price: 20 });
        mockCreateOrder.mockReturnValueOnce(order)     
        const result = await OrderHandler.create(body, 1);
        
        const actual= 'Item added successfully to cart';
        expect(result.message).toEqual(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
        expect(mockIncompleteOrder.mock.calls.length).toBe(2)
        expect(mockCreateOrder.mock.calls.length).toBe(0)
        expect(mockUpdateOrder.mock.calls.length).toBe(1)
        expect(result.order.orderId).toEqual(2);


    })

    it("should give error if product does not exist", async() => {
        let body = { productId: 1, quantity: 1 }
        let validateResult = {
            value: { productId: 1, quantity: 1 },
        }

        mockValidation.mockReturnValue(validateResult)
        mockProductFindOne.mockResolvedValueOnce(null)
        const result = await OrderHandler.create(body, 1);
        
        const actual= new Error('Product does not exist');
        expect(result).toMatchObject(actual);
        expect(mockValidation.mock.calls.length).toBe(1)
    })

})