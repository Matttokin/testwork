import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from './excel.controller';

describe('Excel Controller', () => {
  let controller: ExcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
    }).compile();

    controller = module.get<ExcelController>(ExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
