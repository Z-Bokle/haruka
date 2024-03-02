import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 *
 * 用于避免jwt守卫带来的影响
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
