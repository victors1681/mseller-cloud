// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// ** Reducers
import business from 'src/store/apps/business'
import calendar from 'src/store/apps/calendar'
import chat from 'src/store/apps/chat'
import clients from 'src/store/apps/clients'
import collections from 'src/store/apps/collections'
import communication from 'src/store/apps/communication'
import docTypeSec from 'src/store/apps/docTypeSec'
import documents from 'src/store/apps/documents'
import drivers from 'src/store/apps/driver'
import ecf from 'src/store/apps/ecf'
import ecfDocumentos from 'src/store/apps/ecf/ecfDocumentosSlice'
import email from 'src/store/apps/email'
import inventory from 'src/store/apps/inventory'
import inventoryMovements from 'src/store/apps/inventoryMovements'
import inventoryZones from 'src/store/apps/inventoryZones'
import invoices from 'src/store/apps/invoices'
import itemReturns from 'src/store/apps/itemReturns'
import locations from 'src/store/apps/location'
import paymentTypes from 'src/store/apps/paymentType'
import permissions from 'src/store/apps/permissions'
import pos from 'src/store/apps/pos'
import products from 'src/store/apps/products'
import sellers from 'src/store/apps/seller'
import stockTransfers from 'src/store/apps/stockTransfers'
import transports from 'src/store/apps/transports'
import user from 'src/store/apps/user'
import apikeys from './apps/apikeys'
import cxc from './apps/cxc'
import dashboard from './apps/dashboard'
import offers from './apps/offers'
import onboarding from './apps/onboarding'
import removeData from './apps/removeData'

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
    communication,
    invoices,
    apikeys,
    removeData,
    offers,
    ecf,
    ecfDocumentos,
    business,
    docTypeSec,
    pos,
    inventory,
    inventoryZones,
    inventoryMovements,
    stockTransfers,
    itemReturns,
    cxc,
    dashboard,
    onboarding,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

// ** Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
