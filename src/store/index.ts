// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import documents from 'src/store/apps/documents'
import transports from 'src/store/apps/transports'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import clients from 'src/store/apps/clients'
import products from 'src/store/apps/products'
import paymentTypes from 'src/store/apps/paymentType'
import sellers from 'src/store/apps/seller'
import drivers from 'src/store/apps/driver'
import locations from 'src/store/apps/location'
import collections from 'src/store/apps/collections'
import invoices from 'src/store/apps/invoices'
import apikeys from './apps/apikeys'
import removeData from './apps/removeData'
import offers from './apps/offers'
import ecf from 'src/store/apps/ecf'
import business from 'src/store/apps/business'
import docTypeSec from 'src/store/apps/docTypeSec'
import pos from 'src/store/apps/pos'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    documents,
    calendar,
    permissions,
    transports,
    clients,
    products,
    paymentTypes,
    sellers,
    drivers,
    locations,
    collections,
    invoices,
    apikeys,
    removeData,
    offers,
    ecf,
    business,
    docTypeSec,
    pos,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
