import { FilterQuery, Model, PopulateOptions } from 'mongoose';

interface FilterOptions<T> {
  filter?: FilterQuery<T>,
  sort?: string ,
  select?: string,
  populate?: PopulateOptions[],
  page?: number,
}




export class DatabaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdItem = await this.model.create(data);
    return createdItem;
  }

  async findAll(options: FilterOptions<T>): Promise<T[]> {
    const query = this.model.find(options.filter || {});

    // Optional chaining for other options
    if (options.sort) query.sort(options.sort);
    if (options.select) query.select(options.select);
    if (options.populate) query.populate(options.populate);
    if (options.page) query.skip((options.page - 1) * 10).limit(10); 

    return await query;
  }
  async findOne(data: Partial<T>, populate?: PopulateOptions[]): Promise<T | null> {
   const quary=this.model.findOne(data);
   if (populate) quary.populate(populate);
   return await quary;
  }

  async update(filter: Partial<T>, updateData: Partial<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, updateData, { new: true });
  }
  
  async delete(filter: Partial<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter);
  }
}
