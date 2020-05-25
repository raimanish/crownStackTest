import "jest"
import { Role } from "../../../src/utility/db/models/role.model";
import * as env from '../../../src/utility/system';
import { User } from "../../../src/utility/db/models/user.model";
import { RoleUser } from "../../../src/utility/db/models/roleUser.model";

import bcrypt from 'bcrypt';

import { BootstrapDb } from '../../../src/utility/helpers/BootstrapDb.helper';

describe("Insert Role", () => {
    jest.mock('../../../src/utility/db/models/role.model');
    jest.mock('../../../src/utility/system');

    const environmentVariable = {  port: Number(process.env.PORT) || 4000,
        isDevelopment: true,
        isProduction: false,
        seqUname: "postgres",
        seqPass:"postgres",
        database: "crownstacktest",
        jwt: {
            secret: process.env.JWT_SECRET || "0abc921!z5ef0552c-07e5dfd8-440g"
        },
        roles: ['Admin', 'User'],}
        Object.defineProperty(env, 'Environment', { get: () =>  environmentVariable});


    const mockFindOrCreateRole = jest.fn().mockImplementationOnce(() => 42)
    ;
     
    Role.findOrCreate = mockFindOrCreateRole;
    

    it("insert the roles", async () => {
        mockFindOrCreateRole.mockResolvedValue('Role created');
        await BootstrapDb.insertRole();
        expect(mockFindOrCreateRole.mock.calls.length).toBe(2);
    });
})


describe("Create Admin", () => {
    jest.mock('../../../src/utility/db/models/user.model');
    jest.mock('../../../src/utility/db/models/role.model');
    jest.mock('bcrypt');

    const mockFindOne = jest.fn();
    const mockCreateAdmin = jest.fn();
    const mockFineOneRole = jest.fn();
    const mockGenerateHash = jest.fn();
    const mockAddRoleToUser = jest.fn();

    User.findOne = mockFindOne;      
    User.create = mockCreateAdmin;
    Role.findOne = mockFineOneRole;
    RoleUser.create = mockAddRoleToUser;
    bcrypt.hashSync = jest.fn(() => "hashed_passwrd");

    
    it("should not create admin", async () => {
        var expectedResult =  { userId: 1, name: 'admin', email: 'admin@gmail.com', password: 'test@123' }
        mockFindOne.mockReturnValueOnce(expectedResult)
        
        await BootstrapDb.CreateAdmin();
        expect(mockFindOne.mock.calls.length).toBe(1);
        expect(mockCreateAdmin.mock.calls.length).toBe(0);
    });

    it("should create admin", async () => {
        mockFindOne.mockReturnValueOnce(null)
        mockGenerateHash.mockReturnValueOnce('hashed_password');
        mockFineOneRole.mockReturnValueOnce({ roleId: 1 })
        mockCreateAdmin.mockResolvedValue({ userId: 1 })
        await BootstrapDb.CreateAdmin();

    
        expect(mockCreateAdmin.mock.calls.length).toBe(1);
        expect(mockFineOneRole.mock.calls.length).toBe(1);
        expect(mockAddRoleToUser.mock.calls.length).toBe(1);

    });
})
 