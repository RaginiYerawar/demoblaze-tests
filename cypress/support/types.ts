export interface User {
  username: string
  password: string
}

export interface Product {
  title: string
  price: number
}

export interface CategoryResponse {
  Items: Product[]
}

export interface OrderDetails {
  name: string
  country: string
  city: string
  cardNumber: string
  month: string
  year: string
}
