const pool = require('../src/config/db');
const authRepository = require('../src/repositories/authRepository');

jest.mock('../src/config/db');


describe('authRepository', () => {
  it('should return user rows', async () => {
    const mockRows = [{ id: 1, email: 'test@test.com' }];

    pool.query.mockResolvedValue([mockRows]);

    const result = await authRepository.findUserByEmail('test@test.com');

    expect(pool.query).toHaveBeenCalled();
    expect(result).toEqual(mockRows);
  });
});