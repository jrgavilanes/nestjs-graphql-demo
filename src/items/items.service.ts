import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) { }

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    return await this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find();
    return items;
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemsRepository.preload( updateItemInput);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return await this.itemsRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);    
    return await this.itemsRepository.remove(item);
  }
}
