export interface Currency {
  id: string;
  fullName: string;
}

export interface ConversionRecord {
  value: number;
  currFrom: string;
  currTo: string;
  result: number;
  date: string;
  time: string;
}

export interface IDataProvider {
  getExchangeRate(from: string, to: string): Promise<number>;
  getCurrencies(): Promise<Currency[]>;
}
