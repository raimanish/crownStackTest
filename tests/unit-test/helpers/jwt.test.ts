import "jest"
import * as jwt from 'jsonwebtoken';
import * as env from '../../../src/utility/system';
import { JwtHelper } from '../../../src/utility/helpers/jwt.helper';

describe("New Token", () => {
    it(" return jwt token", async () => {
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

        const jwtSpy = jest.spyOn(JwtHelper, 'newToken');
        JwtHelper.newToken(1);
        expect(jwtSpy).toHaveBeenCalledTimes(1)
        expect(jwtSpy).toHaveBeenCalledWith(1);
    })
})


describe("New Token", () => {
    it(" return jwt token", async () => {
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

        const jwtSpy = jest.spyOn(JwtHelper, 'newToken');
        const result = JwtHelper.newToken(1);
        expect(jwtSpy).toHaveBeenCalledTimes(2);
        expect(jwtSpy).toHaveBeenCalledWith(1);
        const resultVerify = await JwtHelper.verifyToken(result);
        expect(resultVerify.id).toBe(1);
    })

    it(" return error If token is invalid", async () => {
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

        const jwtSpy = jest.spyOn(JwtHelper, 'newToken');
        const result = JwtHelper.newToken(1);
        expect(jwtSpy).toHaveBeenCalledTimes(3);
        expect(jwtSpy).toHaveBeenCalledWith(1);
        var message = "Session Expire"
        JwtHelper.verifyToken("hello").catch(res => {
            message = res;
            expect(message).toEqual('Session Expire Error')
        })
        // const promiseReject = Promise.reject('Session Expire Error'
    })

    it(" return error If token is invalid", async () => {
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

        const jwtSpy = jest.spyOn(JwtHelper, 'newToken');
        const result = JwtHelper.newToken(1);
        expect(jwtSpy).toHaveBeenCalledTimes(4);
        expect(jwtSpy).toHaveBeenCalledWith(1);
        var message = "Session Expire"
        JwtHelper.verifyToken("").catch(res => {
            message = res;
            expect(message).toEqual('Session Expire: No token')
        })
    })
})