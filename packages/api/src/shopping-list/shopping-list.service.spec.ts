import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListService } from './shopping-list.service';
import { PantryService } from '../pantry/pantry.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingList } from './shopping-list.entity';
import { Repository } from 'typeorm';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { CompleteShoppingDto } from './dto/complete-shopping.dto';

const mockShoppingListRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockPantryService = {
  addItem: jest.fn(),
};

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let repository: Repository<ShoppingList>;
  let pantryService: PantryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
        {
          provide: getRepositoryToken(ShoppingList),
          useValue: mockShoppingListRepository,
        },
        {
          provide: PantryService,
          useValue: mockPantryService,
        },
      ],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
    repository = module.get<Repository<ShoppingList>>(getRepositoryToken(ShoppingList));
    pantryService = module.get<PantryService>(PantryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of shopping items for specific user', async () => {
      const userId = 'user-123';
      const result = [{ id: '1', name: 'Milk', userId }];

      mockShoppingListRepository.find.mockResolvedValue(result);

      expect(await service.findAll(userId)).toBe(result);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('create', () => {
    it('should create and save a new item', async () => {
      const userId = 'user-123';
      const dto: CreateShoppingItemDto = {
        name: 'Bread',
        quantity: 1,
        unit: 'шт',
      };

      const createdEntity = { userId, ...dto, category: 'Інше', productId: null };
      const savedEntity = { id: 'new-id', ...createdEntity };

      mockShoppingListRepository.create.mockReturnValue(createdEntity);
      mockShoppingListRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(userId, dto);

      expect(result).toEqual(savedEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
    });
  });

  describe('delete', () => {
    it('should delete item by id and userId', async () => {
      const userId = 'user-123';
      const itemId = 'item-1';

      mockShoppingListRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(userId, itemId);

      expect(repository.delete).toHaveBeenCalledWith({ id: itemId, userId });
    });
  });

  // === ВИПРАВЛЕНИЙ ТЕСТ ===
  describe('completeShopping', () => {
    it('should move items to pantry and delete from shopping list', async () => {
      const userId = 'user-123';
      const dto: CompleteShoppingDto = { ids: ['item-1', 'item-2'] };

      const itemsInDb = [
        { id: 'item-1', name: 'Milk', quantity: 1, unit: 'l', category: 'Dairy', userId },
        { id: 'item-2', name: 'Eggs', quantity: 10, unit: 'pcs', category: 'Dairy', userId },
      ];

      // ВАЖЛИВО: Сервіс використовує .find() з масивом ID, тому ми мокаємо find,
      // щоб він повернув масив з двох елементів
      mockShoppingListRepository.find.mockResolvedValue(itemsInDb);

      // Мокаємо успішне видалення
      mockShoppingListRepository.delete.mockResolvedValue({ affected: 1 });

      await service.completeShopping(userId, dto);

      // 1. Перевіряємо, що find був викликаний
      expect(repository.find).toHaveBeenCalled();

      // 2. Перевіряємо, що PantryService.addItem викликаний 2 рази (для кожного товару)
      expect(pantryService.addItem).toHaveBeenCalledTimes(2);
      expect(pantryService.addItem).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ name: 'Milk' })
      );
      expect(pantryService.addItem).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ name: 'Eggs' })
      );

      // 3. Перевіряємо, що delete викликаний 2 рази
      expect(repository.delete).toHaveBeenCalledTimes(2);
      expect(repository.delete).toHaveBeenCalledWith('item-1');
      expect(repository.delete).toHaveBeenCalledWith('item-2');
    });
  });
});
