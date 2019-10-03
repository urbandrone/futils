import { Sum } from './Sum';
import { Product } from './Product';
import { Min } from './Min';
import { Max } from './Max';
import { Char } from './Char';
import { Fn } from './Fn';
import { Any } from './Any';
import { All } from './All';
import { Record } from './Record';
import { compatMonoid as flCompatMonoid } from '../core/fl-compat';

/**
 * @module monoid
 * @requires adt
 * @requires generics.Show
 * @requires generics.Eq
 * @requires generics.Ord
 */

export default {
  Sum: flCompatMonoid(Sum),
  Product: flCompatMonoid(Product),
  Min: flCompatMonoid(Min),
  Max: flCompatMonoid(Max),
  Char: flCompatMonoid(Char),
  Fn: flCompatMonoid(Fn),
  Any: flCompatMonoid(Any),
  All: flCompatMonoid(All),
  Record: flCompatMonoid(Record)
};
