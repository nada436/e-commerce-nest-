import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { copounRepository } from './../../repository/copoun.repository.service ';

@Injectable()

export class CopounService {
constructor(private readonly copounRepository:copounRepository){}
/////////////////////////////// CREATE ///////////////////////////////////
async createCopoun(data, user) {
    // Check if code already exists
    const existingCopoun = await this.copounRepository.findOne({ code: data.code })
    if (existingCopoun) {
      throw new BadRequestException('Coupon code already exists');
    }

    // Validate dates
    const fromDate = new Date(data.from_date);
    const toDate = new Date(data.to_date);
    

    if (fromDate < new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }
    if (fromDate >= toDate) {
        throw new BadRequestException('End date must be after start date');
      }
    // Create new coupon
    const copounInfo = {
      ...data,
      userId: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newCopoun = await this.copounRepository.create(copounInfo);
    return newCopoun;
  }

  /////////////////////////////// UPDATE ///////////////////////////////////
  async updateCopoun(id, data, user) {
    // Check if coupon exists
    const existingCopoun = await this.copounRepository.findOne({_id:id})
    if (!existingCopoun) {
      throw new NotFoundException('Coupon not found');
    }

    // Verify ownership
    if (existingCopoun.userId.toString() !== user._id.toString()) {
      throw new BadRequestException('You can only update your own coupons');
    }

    // Prevent code change if code exists in data
    if (data.code && data.code !== existingCopoun.code) {
      const codeExists = await this.copounRepository.findOne({ 
        code: data.code,
    
      })
      
      if (codeExists) {
        throw new BadRequestException('Coupon code already exists');
      }
    }

    // Validate dates if provided
    if (data.from_date || data.to_date) {
      const fromDate = data.from_date ? new Date(data.from_date) : existingCopoun.from_date;
      const toDate = data.to_date ? new Date(data.to_date) : existingCopoun.to_date;
      
      if (fromDate >= toDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // Update coupon
    const updatedData = {
      ...data,
      updatedAt: new Date()
    };

    const updatedCopoun = await this.copounRepository.update(
    { _id: id},
      updatedData,
    
    )

    return {
        message: 'Coupon updated successfully',
      };
  }

  /////////////////////////////// DELETE ///////////////////////////////////
  async deleteCopoun(id, user) {
    // Check if coupon exists
    const existingCopoun = await this.copounRepository.findOne({_id:id});
    if (!existingCopoun) {
      throw new NotFoundException('Coupon not found');
    }

    // Verify ownership
    if (existingCopoun.userId.toString() !== user._id.toString()) {
      throw new BadRequestException('You can only delete your own coupons');
    }

   await this.copounRepository.delete({_id:id});

    return {
      message: 'Coupon deleted successfully',
    };
  }










}
