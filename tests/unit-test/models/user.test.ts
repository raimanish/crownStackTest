import "jest";
import { User } from '../../../src/utility/db/models/user.model';
import { Role } from '../../../src/utility/db/models/role.model';
import { RoleUser } from "../../../src/utility/db/models/roleUser.model";

describe("Add Role", () => {
    jest.mock('../../../src/utility/db/models/user.model')
    jest.mock('../../../src/utility/db/models/role.model')
    jest.mock('../../../src/utility/db/models/roleUser.model')


    const mockFindOneRole = jest.fn();
    const mockRoleUserCreate = jest.fn();

    Role.findOne = mockFindOneRole;
    RoleUser.create = mockRoleUserCreate;

    it("role should add", async () => {
        mockFindOneRole.mockResolvedValue({ roleId: 1 })
        await User.addUserRole({ userId: 1 })
        expect(mockFindOneRole.mock.calls.length).toBe(1);
        expect(mockRoleUserCreate.mock.calls.length).toBe(1);
    })
})