import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import {
  CheckoutOrderDto,
  CheckoutResponseDto,
  OrderResponseDto,
} from '../order/dto';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { UpdateCartDto, CartItemResponseDto } from './dto';

@ApiBasicAuth('basic')
@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiTags('cart')
  @ApiOperation({ summary: 'Get current user cart items' })
  @ApiResponse({ status: 200, type: [CartItemResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items;
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  @ApiTags('cart')
  @ApiOperation({
    summary: 'Add or update product in cart',
    description: 'Set count to 0 to remove the product from cart',
  })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, type: [CartItemResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUserCart(@Req() req: AppRequest, @Body() body: UpdateCartDto) {
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiTags('cart')
  @ApiOperation({ summary: 'Clear current user cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  @UseGuards(BasicAuthGuard)
  @Put('order')
  @ApiTags('orders')
  @ApiOperation({ summary: 'Checkout cart and create order' })
  @ApiBody({ type: CheckoutOrderDto })
  @ApiResponse({ status: 200, type: CheckoutResponseDto })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkout(@Req() req: AppRequest, @Body() body: CheckoutOrderDto) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      throw new BadRequestException('Cart is empty');
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(items);
    const order = await this.orderService.create({
      userId,
      cartId,
      items: items.map(({ product, count }) => ({
        productId: product.id,
        count,
      })),
      address: body.address,
      total,
    });

    await this.cartService.markAsOrdered(cartId);

    return {
      order,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  @ApiTags('orders')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrder() {
    return this.orderService.getAll();
  }
}
