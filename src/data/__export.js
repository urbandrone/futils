import { Id } from './Id';
import { Maybe } from './Maybe';
import { Either } from './Either';
import { List } from './List';
import { IO } from './IO';
import { State } from './State';
import { Task } from './Task';
import { Free } from './Free';
import { Pair } from './Pair';
import * as fl from '../core/fl-compat';

/**
 * 
 * @module data
 * @requires adt
 * @requires generics.Show
 * @requires generics.Eq
 * @requires generics.Ord
 */

export default {
  Id: fl.compatId(Id),
  Maybe: fl.compatMaybe(Maybe),
  Either: fl.compatEither(Either),
  List: fl.compatList(List),
  IO: fl.compatIO(IO),
  State: fl.compatState(State),
  Task: fl.compatTask(Task),
  Free: fl.compatFree(Free),
  Pair: fl.compatPair(Pair)
}