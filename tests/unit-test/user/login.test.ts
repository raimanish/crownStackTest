import "jest";

import { UserHandler }  from '../../../src/resources/User/User.handler';
import UserValidator  from '../../../src/resources/User/User.validator';
import { User } from '../../../src/utility/db/models/user.model';
import SequlizeConnection from '../../../src/utility/db/SequlizeConnection';
import { JwtHelper } from "../../../src/utility/helpers/jwt.helper";

import bcrypt from 'bcrypt';

describe('User Login In', function(){    
  
  jest.mock('../../../src/resources/User/User.validator');
  jest.mock('../../../src/utility/db/models/user.model')
  jest.mock('../../../src/utility/helpers/BootstrapDb.helper')
  jest.mock('../../../src/utility/db/SequlizeConnection')
  jest.mock('../../../src/utility/helpers/jwt.helper')
  jest.mock('bcrypt');

  const mockValidation = jest.fn();
  const mockFindOne = jest.fn();
  const mockJwtHelper = jest.fn();

  UserValidator.Login.validate = mockValidation;
  User.findOne = mockFindOne;  
  SequlizeConnection.sequelize = jest.fn()
  JwtHelper.newToken  = mockJwtHelper;

  beforeEach(jest.clearAllMocks)

  it('Should give Error if body does not have Email: email is required', async () =>{
      var body = { password: 'test@123' }
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
        }// it('Should give not giv error', async () =>{
  //   //mockValidation.mockReturnValueOnce(7);
  //   const val =  await UserHandler.add(1,6);
  //   expect(val).toBe(6)
  // })
        
      mockValidation.mockReturnValue(validateResult)
      const result = await UserHandler.login(body, 'USER');
      
      const actual= new Error('email is required');
      expect(result).toMatchObject(actual);
      expect(mockValidation.mock.calls.length).toBe(1);
  })

  it('Should give Error if body does not have password: password is required', async () =>{
    var body = { email: 'test@gmail.com' }
    var validateResult = {
        value: {  email: 'test@gmail.com'},
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
    const result = await UserHandler.login(body, 'USER');
    
    const actual= new Error('password is required');
    expect(result).toMatchObject(actual);
    expect(mockValidation.mock.calls.length).toBe(1)

})

  it('Should give Error if User does not exist', async () =>{
    var body = {  email: 'manish@gmail.com', password: 'test@123' }
    var validateResult = {
        value: { password: 'test@12377', email: 'manish@gmail.com' },
      }
      
    mockValidation.mockReturnValue(validateResult)
    mockFindOne.mockReturnValueOnce(null)
    const result = await UserHandler.login(body, 'USER');
    
    const actual= new Error('Either email or password is wrong');
    expect(result).toMatchObject(actual);
  })

  it('Should give Error if password does not match', async () =>{
    var body = { email: 'manish@gmail.com', password: 'test@123' }
    var validateResult = {
        value: { password: 'test@12377', email: 'manish@gmail.com' },
      }
    var userCreateResult = {
      value: {userId:1, name: 'Manish rai', password: 'hashed_password', email: 'manish@gmail.com' },
    }

    mockValidation.mockReturnValue(validateResult)
    mockFindOne.mockReturnValueOnce(userCreateResult)
    bcrypt.compareSync = jest.fn(() => false);

    const result = await UserHandler.login(body, 'USER');

    const actual= { message: 'Either email or password is wrong'};
    expect(result).toMatchObject(actual);
    expect(mockValidation.mock.calls.length).toBe(1)
    expect(mockFindOne.mock.calls.length).toBe(1)

  })


  
  it('Login Successfully', async () =>{
    var body = { email: 'manish@gmail.com', password: 'test@123' }
    var validateResult = {
        value: { password: 'test@12377', email: 'manish@gmail.com' },
      }
    var userCreateResult = {
      value: {userId:1, name: 'Manish rai', password: 'hashed_password', email: 'manish@gmail.com' },
    }

    mockValidation.mockReturnValue(validateResult)
    mockFindOne.mockReturnValueOnce(userCreateResult)
    bcrypt.compareSync = jest.fn(() => true);
    mockJwtHelper.mockReturnValue('new_login_token')
    
    const result = await UserHandler.login(body, 'USER');
    const actual= { token: 'new_login_token' }
    expect(result).toMatchObject(actual);
    expect(mockValidation.mock.calls.length).toBe(1)
    expect(mockFindOne.mock.calls.length).toBe(1)
    expect(mockJwtHelper.mock.calls.length).toBe(1)
  })

  it("should throw error user find one fails", async() => {
       
    var body = { name: 'Manish', email: 'manish@gmail.com', password: 'test@123' }
    mockFindOne.mockRejectedValueOnce('User find failed')
    const response = await UserHandler.login(body, 'User')
    expect(mockFindOne.mock.calls.length).toBe(1)
    expect(response).toEqual('User find failed')
  })
  
})