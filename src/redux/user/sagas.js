/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import actions from './actions'

const mapAuthProviders = {}

export function* LOGIN({ payload }) {}

export function* REGISTER({ payload }) {}

export function* LOAD_CURRENT_ACCOUNT() {}

export function* LOGOUT() {}

export default function* rootSaga() {}
