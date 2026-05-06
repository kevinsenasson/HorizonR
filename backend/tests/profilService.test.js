const service = require('../src/services/profilService');
const repo    = require('../src/repositories/profilRepository');
const bcrypt  = require('bcrypt');

jest.mock('../src/repositories/profilRepository');
jest.mock('bcrypt');

describe('profilService', () => {

  beforeEach(() => jest.clearAllMocks());

  // getProfil
  it('getProfil - trouvé', async () => {
    repo.findById.mockResolvedValue({ id: 1, nom: 'Doe' });
    const res = await service.getProfil(1);
    expect(res.nom).toBe('Doe');
  });

  it('getProfil - non trouvé', async () => {
    repo.findById.mockResolvedValue(undefined);
    const res = await service.getProfil(99);
    expect(res.error).toBe('not found');
  });

  // changerMotDePasse
  it('changerMotDePasse - champs manquants', async () => {
    const res = await service.changerMotDePasse(1, {});
    expect(res.error).toBe('missing fields');
  });

  it('changerMotDePasse - mot de passe faible', async () => {
    const res = await service.changerMotDePasse(1, {
      ancien_mot_de_passe: 'old',
      nouveau_mot_de_passe: '1234'
    });
    expect(res.error).toBe('weak password');
  });

  it('changerMotDePasse - ancien mot de passe incorrect', async () => {
    repo.findPasswordById.mockResolvedValue({ mot_de_passe: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);
    const res = await service.changerMotDePasse(1, {
      ancien_mot_de_passe: 'wrong',
      nouveau_mot_de_passe: 'Aa1@aaaa'
    });
    expect(res.error).toBe('wrong password');
  });

  it('changerMotDePasse - succès', async () => {
    repo.findPasswordById.mockResolvedValue({ mot_de_passe: 'hashed' });
    bcrypt.compare.mockResolvedValue(true);
    bcrypt.hash.mockResolvedValue('newHash');
    repo.updatePassword.mockResolvedValue();
    const res = await service.changerMotDePasse(1, {
      ancien_mot_de_passe: 'correct',
      nouveau_mot_de_passe: 'Aa1@aaaa'
    });
    expect(res.ok).toBe(true);
    expect(repo.updatePassword).toHaveBeenCalledWith(1, 'newHash');
  });

});
