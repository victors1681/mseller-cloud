type StripePriceType = {
  id: string
  unit_amount: number
  currency: string
  recurring?: {
    interval: string
  }
}

type StripeProductType = {
  id: string
  name: string
  description: string
  images: string[]
  prices: StripePriceType[]
}
