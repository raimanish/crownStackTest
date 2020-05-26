import "jest"
import * as env from '../../../src/utility/system';
import { BootstrapDb } from "../../../src/utility/helpers/BootstrapDb.helper";
import SequlizeConnection  from '../../../src/utility/db/SequlizeConnection';

describe('verifying SequlizeConnection', () => {
    jest.mock('../../../src/utility/system');
    jest.mock('../../../src/utility/helpers/BootstrapDb.helper');

    it( "createConnection",  (done) => {
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
            const mockInsertRole = jest.fn();
            const mockCreateAdmin = jest.fn()
        
            BootstrapDb.insertRole = mockInsertRole;
            BootstrapDb.CreateAdmin = mockCreateAdmin;
            const createConnectionSpy = jest.spyOn(SequlizeConnection, 'createConnection');
            SequlizeConnection.createConnection()

            expect(createConnectionSpy).toBeCalledTimes(1)
            done();
    })
})  