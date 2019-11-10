import { Epic, ofType } from 'redux-observable'
import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, map, mergeMap } from 'rxjs/operators'

import {
  apiActions,
  GET_ETH_PRICE,
  GET_ETH_PRICE_SUCCESS,
  GET_TOKEN_RESERVES,
  GET_TOKEN_RESERVES_SUCCESS,
  GET_USERS_COUNT,
  GET_USER_HEALTH,
  GET_USER_HISTORY
} from './'
import { RootAction, RootState } from '../../store'

// Types
import {
  TokenReserve,
  UsersCount,
  UserHistory,
  UserHealth
} from '../../../types'

const getEthPriceEpic: Epic<RootAction, RootAction, RootState> = action$ => {
  return action$.pipe(
    ofType(GET_ETH_PRICE),
    mergeMap(() =>
      ajax
        .getJSON(
          'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
        )
        .pipe(
          map(response => apiActions.getEthPriceSuccess((response as any).USD)),
          catchError(error => of(apiActions.getEthPriceError(error)))
        )
    )
  )
}

const getEthPriceSuccessEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = action$ => {
  return action$.pipe(
    ofType(GET_ETH_PRICE_SUCCESS),
    mergeMap(() => of(apiActions.getTokenReserves()))
  )
}

const getTokenReservesEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = action$ => {
  return action$.pipe(
    ofType(GET_TOKEN_RESERVES),
    mergeMap(() =>
      ajax.getJSON('https://dlp-api-dev.testing.aave.com/data/reserves').pipe(
        map(response =>
          apiActions.getTokenReservesSuccess(response as TokenReserve[])
        ),
        catchError(error => of(apiActions.getTokenReservesError(error)))
      )
    )
  )
}

const getTokenReservesSuccessEpic: Epic<
  RootAction,
  RootAction,
  RootState
> = action$ => {
  return action$.pipe(
    ofType(GET_TOKEN_RESERVES_SUCCESS),
    mergeMap(() => of(apiActions.getUserHistory()))
  )
}

const getUsersCountEpic: Epic<RootAction, RootAction, RootState> = action$ => {
  return action$.pipe(
    ofType(GET_USERS_COUNT),
    mergeMap(() =>
      ajax.getJSON('https://aavemonitor.herokuapp.com/count/').pipe(
        map(response =>
          apiActions.getUsersCountSuccess(response as UsersCount)
        ),
        catchError(error => of(apiActions.getUsersCountError(error)))
      )
    )
  )
}

const getUserHealthEpic: Epic<RootAction, RootAction, RootState> = action$ => {
  return action$.pipe(
    ofType(GET_USER_HEALTH),
    mergeMap(() =>
      ajax.getJSON('https://aavemonitor.herokuapp.com/health').pipe(
        map(response => {
          return apiActions.getUserHealthSuccess(response as UserHealth[])
        }),
        catchError(error => of(apiActions.getUserHealthError(error)))
      )
    )
  )
}

const getUserHistoryEpic: Epic<RootAction, RootAction, RootState> = action$ => {
  return action$.pipe(
    ofType(GET_USER_HISTORY),
    mergeMap(() =>
      ajax.getJSON('https://aavemonitor.herokuapp.com/history').pipe(
        map(response => {
          return apiActions.getUserHistorySuccess(response as UserHistory[])
        }),
        catchError(error => of(apiActions.getUserHistoryError(error)))
      )
    )
  )
}

export default [
  getEthPriceEpic,
  getEthPriceSuccessEpic,
  getTokenReservesEpic,
  getTokenReservesSuccessEpic,
  getUsersCountEpic,
  getUserHealthEpic,
  getUserHistoryEpic
]