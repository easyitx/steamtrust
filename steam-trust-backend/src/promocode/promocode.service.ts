import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PromoCode, PromocodeDocument } from './promocode.schema';
import {
  CreatePromocodeReq,
  PromocodeListReq,
} from './promocode.dto';
import {
  PromoActivation,
  PromoActivationSchema,
  PromoActivationStatus,
} from './promo-activation.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  mongooseTransaction,
  Order,
  ClientInfoDto,
} from '@app/common';
import { CustomException } from '../common/errors/custom-exception';

@Injectable()
export class PromocodeService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(PromoCode.name)
    private promoCodeModel: Model<PromocodeDocument>,
    @InjectModel(PromoActivation.name)
    private promoActivationModel: Model<PromoActivation>,
  ) {}

  async onApplicationBootstrap() {
    const promocodes = ['welcome'];
    for (const code of promocodes) {
      const promo = await this.promoCodeModel.findOne({
        code: code.toLowerCase(),
      });
      if (!promo) {
        await this.promoCodeModel.create({
          code: code.toLowerCase(),
        });
      }
    }
  }

  async createPromocode(
    createPromocodeDto: CreatePromocodeReq,
  ): Promise<PromoCode> {
    const isExistPromo = await this.promoCodeModel.findOne({
      code: createPromocodeDto.code,
      deletedAt: null,
    });

    if (isExistPromo) {
      throw CustomException.validationError({ 
        message: 'Promo code already exists',
        code: createPromocodeDto.code 
      });
    }

    const createdPromocode = new this.promoCodeModel({
      ...createPromocodeDto,
    });

    return createdPromocode.save();
  }

  async getPromocodes(query: PromocodeListReq) {
    const { page = 1, limit = 10, order = Order.desc } = query;

    const skip = (page - 1) * limit;

    const [promocodes, total] = await Promise.all([
      this.promoCodeModel
        .find({ deletedAt: null })
        .sort({ createdAt: order === Order.asc ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.promoCodeModel.countDocuments({ deletedAt: null }),
    ]);

    return {
      data: promocodes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPromocode(code: string): Promise<PromoCode> {
    const promocode = await this.promoCodeModel.findOne({
      code: code.toLowerCase(),
      deletedAt: null,
    });

    if (!promocode) {
      throw CustomException.promocodeNotFound(code);
    }

    return promocode;
  }

  async updatePromocode(id: string, data: CreatePromocodeReq): Promise<PromoCode> {
    const promocode = await this.promoCodeModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );

    if (!promocode) {
      throw CustomException.notFound('Promo code');
    }

    return promocode;
  }

  async activatePromocode(code: string, userEmail: string): Promise<PromoActivation> {
    const promocode = await this.getPromocode(code);

    if (!promocode) {
      throw CustomException.promocodeNotFound(code);
    }

    const existingActivation = await this.promoActivationModel.findOne({
      promocodeId: promocode._id,
      userEmail: userEmail,
      status: PromoActivationStatus.active,
    });

    if (existingActivation) {
      throw CustomException.promocodeAlreadyUsed(code);
    }

    // Создаем активацию
    const activation = new this.promoActivationModel({
      promocodeId: promocode._id,
      email: userEmail,
      ip: null, // Assuming ip is not directly available in the new structure
      status: PromoActivationStatus.active,
      activatedAt: new Date(),
    });

    await activation.save();

    return activation;
  }

  async getActiveUserActivation(email: string): Promise<any> {
    const userActivation = await this.promoActivationModel.findOne({
      email: email,
      status: PromoActivationStatus.active,
    });

    if (!userActivation) {
      return null;
    }

    const promocode = await this.promoCodeModel.findOne({
      _id: userActivation.promocodeId.toString(),
    });

    if (!promocode) {
      return null;
    }

    return promocode;
  }

  async bonusPaidPromo(email: string): Promise<void> {
    const activations = await this.promoActivationModel.find({
      status: PromoActivationStatus.active,
      email: email,
    });

    const updatePromises = activations.map(async (activation) => {
      activation.status = PromoActivationStatus.applied;
      return activation.save();
    });

    await Promise.all(updatePromises);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredActivations(): Promise<void> {
    // Очистка устаревших активаций
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    await this.promoActivationModel.updateMany(
      {
        status: PromoActivationStatus.active,
        activatedAt: { $lt: thirtyDaysAgo },
      },
      {
        status: PromoActivationStatus.expired,
      },
    );
  }
}
