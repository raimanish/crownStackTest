import "jest";

import { UserHandler }  from '../../../src/resources/User/User.handler';
import UserValidator  from '../../../src/resources/User/User.validator';
import { User } from '../../../src/utility/db/models/user.model';
import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';
import bcrypt from 'bcrypt';

describe('User Sign Up', function(){    

  jest.mock('../../../src/resources/User/User.validator');
  jest.mock('../../../src/utility/db/models/user.model')
  jest.mock('../../../src/utility/helpers/BootstrapDb.helper')
  jest.mock('../../../src/utility/db/SequlizeConnection')

  const mockValidation = jest.fn();
  const mockFindOne = jest.fn();
  const mockUserCreate = jest.fn();
  const mockHashPwd = jest.fn();
  const mockSequlizeConnection = jest.fn()

  UserValidator.SignUp.validate = mockValidation;
  User.findOne = mockFindOne;  
  User.create = mockUserCreate;
  SequlizeConnection.sequelize = jest.fn()
  SequlizeConnection.sequelize.transaction = jest.fn();
  
  beforeEach(jest.clearAllMocks)

  it('Should give Error if body does not have Email: email is required', async () =>{
      var body = { name: 'Manish', password: 'test@123' }
      var validateResult = {
          value: { name: 'Manish rai', password: 'test@123' },
          error: {
              details: [
                  {
                    message: '"email" is required',
                    path: [ 'email' ],
                    type: 'any.required',
                    context: { label: 'email', key: 'email' }                
                  }
                ]  
          }
        }
        
      mockValidation.mockReturnValue(validateResult)
      const result = await UserHandler.signUp(body);
      
      const actual= new Error('email is required');
      expect(result).toMatchObject(actual);
  })

  it('Should give Error if body does not have password: password is required', async () =>{
    var body = { name: 'Manish',  email: 'test@gmail.com' }
    var validateResult = {
        value: { name: 'Manish rai', email: 'test@gmail.com'},
        error: {
            details: [
                {
                  message: '"password" is required',
                  path: [ 'password' ],
                  type: 'any.required',
                  context: { label: 'password', key: 'password' }                
                }
              ]  
        }
      }
      
    mockValidation.mockReturnValue(validateResult)
    const result = await UserHandler.signUp(body);
    
    const actual= new Error('password is required');
    expect(result).toMatchObject(actual);
})

  it('Should give Error if validation failed:', async () =>{
    var body = { name: 'Manish',  passwod: 'test@123', email: 'test@gmail.com' }
    var validateResult = {
        value: { name: 'Manish rai', password: 'test@123', email: 'test@gmail.com'},
        error: {
            details: [
                {
                  message: 'name can have a maximum length of 100',
                  path: [ 'name' ],
                  type: 'any.required',
                  context: { label: 'name', key: 'name' }                
                }
              ]  
        }
      }
      
    mockValidation.mockReturnValue(validateResult)
    const result = await UserHandler.signUp(body);
    
    const actual= new Error('name can have a maximum length of 100');
    expect(result).toMatchObject(actual);
  })

  it('Should give Error if User already exist', async () =>{
    var body = { name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    var expectedResult =  { userId: 1, name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    var validateResult = {
        value: { name: 'Manish rai', password: 'test@12377', email: 'manish@gmail.com' },
      }
      
    mockValidation.mockReturnValue(validateResult)
    mockFindOne.mockReturnValueOnce(expectedResult)
    const result = await UserHandler.signUp(body);
    
    const actual= new Error('User already exist');
    expect(result).toMatchObject(actual);
  })

  it('Should get Sign up successfull', async () =>{
    var body = { name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    var validateResult = {
        value: { name: 'Manish rai', password: 'test@12377', email: 'manish@gmail.com' },
      }
    var userCreateResult = {
      value: {userId:1, name: 'Manish rai', password: 'hashed_password', email: 'manish@gmail.com' },
    }

    mockValidation.mockReturnValue(validateResult)
    mockFindOne.mockReturnValueOnce(null)
    mockHashPwd.mockResolvedValue('hashed_password');
    mockUserCreate.mockResolvedValueOnce(userCreateResult)
    mockSequlizeConnection.mockResolvedValueOnce('test')
    bcrypt.hashSync = jest.fn(() => "hashed_password")
    const result = await UserHandler.signUp(body);
    
    const actual= { message: 'Sign up successfully' };
    expect(result).toMatchObject(actual);
  })

  it("should throw error if user find one fails", async() => {
       
    var body = { name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    mockFindOne.mockRejectedValueOnce('User find failed')
    const response = await UserHandler.signUp(body)
    expect(mockUserCreate.mock.calls.length).toBe(0)
    expect(mockFindOne.mock.calls.length).toBe(1)
    expect(response).toBe('User find failed')
  })

  it("should throw error if user creation fails", async() => {  
    var body = { name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    mockFindOne.mockReturnValueOnce(null)

    mockUserCreate.mockRejectedValueOnce('User creation failed')
    const response = await UserHandler.signUp(body)
    expect(mockUserCreate.mock.calls.length).toBe(1)
    expect(mockFindOne.mock.calls.length).toBe(1)
    expect(response).toEqual('User creation failed')
  })

})
