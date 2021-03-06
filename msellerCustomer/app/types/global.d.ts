declare module '*.png' {
  const value: any;
  export = value;
}

declare module '@env' {
  export const DEV_GRAPHQL_URL: string;
  export const PROD_GRAPHQL_URL: string;
}

declare module 'react-native-image-slider-box' {
  export const SliderBox: any;
}

declare module 'react-native-dialog-input' {
  export const DialogInput: any;
  export default DialogInput;
}
