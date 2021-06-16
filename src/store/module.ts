import NumFactoryStateTypes from './modules/NumFactory/module'

export default interface RootStateTypes {
  text: string
}

export interface AllStateTypes extends RootStateTypes {
  numFactoryModule: NumFactoryStateTypes
}
