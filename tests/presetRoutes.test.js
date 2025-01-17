const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Preset = require('../models/preset');
const connectDB = require('../config/db');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await connectDB(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Preset.deleteMany({});
});

describe('Preset Routes', () => {
  it('should create a new preset', async () => {
    const presetData = {
      name: 'testPreset',
      structure: { key: 'value' }
    };

    const response = await request(app)
      .post('/api/presets')
      .send(presetData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Preset created successfully');
    expect(response.body.preset.name).toBe(presetData.name);
    expect(response.body.preset._id).toBeDefined();
  });

  it('should get a list of presets', async () => {
    const presets = await Preset.create([
      { name: 'preset1', structure: { key: 'value1' } },
      { name: 'preset2', structure: { key: 'value2' } }
    ]);

    const response = await request(app)
      .get('/api/presets');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });

  it('should get a specific preset', async () => {
    const testPreset = await Preset.create({
      name: 'testPreset',
      structure: { key: 'value' }
    });

    const response = await request(app)
      .get(`/api/presets/${testPreset._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(testPreset._id.toString());
  });

  it('should update an existing preset', async () => {
    const initialPreset = await Preset.create({
      name: 'updateTest',
      structure: { key: 'initial value' }
    });

    const updatedData = {
      name: 'updatedName',
      structure: { key: 'updated value' }
    };
    
    const response = await request(app)
      .put(`/api/presets/${initialPreset._id}`)
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Preset updated successfully');
    expect(response.body.preset.structure).toEqual(updatedData.structure);
    expect(response.body.preset.name).toBe(updatedData.name);
  });

  it('should delete an existing preset', async () => {
    const preset = await Preset.create({
      name: 'deleteTest',
      structure: { key: 'value' }
    });

    const response = await request(app)
      .delete(`/api/presets/${preset._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Preset deleted successfully');
    
    const deletedPreset = await Preset.findById(preset._id);
    expect(deletedPreset).toBeNull();
  });

  it('should return 404 for non-existent preset', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/presets/${fakeId}`);

    expect(response.statusCode).toBe(404);
  });
}); 