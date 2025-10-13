// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import business from 'src/store/apps/business'
import calendar from 'src/store/apps/calendar'
import chat from 'src/store/apps/chat'
import clients from 'src/store/apps/clients'
import collections from 'src/store/apps/collections'
import docTypeSec from 'src/store/apps/docTypeSec'
import documents from 'src/store/apps/documents'
import drivers from 'src/store/apps/driver'
import ecf from 'src/store/apps/ecf'
import email from 'src/store/apps/email'
import inventory from 'src/store/apps/inventory'
import inventoryZones from 'src/store/apps/inventoryZones'
import invoices from 'src/store/apps/invoices'
import locations from 'src/store/apps/location'
import paymentTypes from 'src/store/apps/paymentType'
import permissions from 'src/store/apps/permissions'
import pos from 'src/store/apps/pos'
import products from 'src/store/apps/products'
import sellers from 'src/store/apps/seller'
import transports from 'src/store/apps/transports'
import user from 'src/store/apps/user'
import apikeys from './apps/apikeys'
import offers from './apps/offers'
import removeData from './apps/removeData'
import cxc from './apps/cxc'

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
    inventory,
    inventoryZones,
    cxc,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
